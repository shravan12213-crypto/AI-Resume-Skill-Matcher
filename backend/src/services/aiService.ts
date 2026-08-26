import { query, pool } from '../config/db';

// Using native fetch to avoid unauthorized dependency installation
export const extractResumeData = async (rawText: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const prompt = `
    You are an AI resume extraction assistant.
    Convert the following resume text into a structured JSON object.
    Do NOT invent any information. If a section is empty or missing, return an empty array.
    Extract the candidate's skills into a simple array of strings.
    
    Resume Text:
    ${rawText}
  `;

  // We are using the native fetch API for REST to satisfy the 'no unauthorized dependency' rule
  // while utilizing OpenAI's JSON Schema structured outputs.
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'resume_extraction',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              education: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    degree: { type: 'string' },
                    institution: { type: 'string' },
                    field: { type: 'string' },
                    start_year: { type: ['number', 'null'] },
                    end_year: { type: ['number', 'null'] }
                  },
                  required: ['degree', 'institution', 'field', 'start_year', 'end_year'],
                  additionalProperties: false
                }
              },
              experience: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    role: { type: 'string' },
                    company: { type: 'string' },
                    years: { type: ['number', 'null'] }
                  },
                  required: ['role', 'company', 'years'],
                  additionalProperties: false
                }
              },
              projects: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' }
                  },
                  required: ['name', 'description'],
                  additionalProperties: false
                }
              },
              certifications: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' }
                  },
                  required: ['name'],
                  additionalProperties: false
                }
              },
              skills: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['education', 'experience', 'projects', 'certifications', 'skills'],
            additionalProperties: false
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API Error: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  if (!content) {
    throw new Error('Malformed AI response');
  }

  return JSON.parse(content);
};

export const saveExtractionAndSkills = async (
  resumeId: number,
  candidateId: number,
  extractedData: any
) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Upsert extraction data
    const sqlExtraction = `
      INSERT INTO resume_extracted_data (resume_id, education, experience, projects, certifications, extracted_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (resume_id) 
      DO UPDATE SET 
        education = EXCLUDED.education,
        experience = EXCLUDED.experience,
        projects = EXCLUDED.projects,
        certifications = EXCLUDED.certifications,
        extracted_at = NOW()
      RETURNING *;
    `;
    const extractionResult = await client.query(sqlExtraction, [
      resumeId,
      JSON.stringify(extractedData.education || []),
      JSON.stringify(extractedData.experience || []),
      JSON.stringify(extractedData.projects || []),
      JSON.stringify(extractedData.certifications || [])
    ]);

    // Normalize and insert skills
    const rawSkills: string[] = extractedData.skills || [];
    for (const skillName of rawSkills) {
      const trimmedName = skillName.trim();
      if (!trimmedName) continue;

      let skillId: number | null = null;

      // Case-insensitive lookup
      const sqlSelectSkill = `
        SELECT skill_id, skill_name 
        FROM skills 
        WHERE LOWER(skill_name) = LOWER($1)
        LIMIT 1;
      `;
      const existRes = await client.query(sqlSelectSkill, [trimmedName]);

      if (existRes.rows.length > 0) {
        // Reuse existing
        skillId = existRes.rows[0].skill_id;
      } else {
        // Insert new skill using canonical form from AI
        const sqlSkill = `
          INSERT INTO skills (skill_name)
          VALUES ($1)
          RETURNING skill_id;
        `;
        const skillRes = await client.query(sqlSkill, [trimmedName]);
        skillId = skillRes.rows[0].skill_id;
      }

      if (skillId) {
        // Upsert candidate_skills with NULL proficiency and years_experience
        // ON CONFLICT DO NOTHING ensures we preserve existing data if it already exists
        const sqlCandidateSkill = `
          INSERT INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience)
          VALUES ($1, $2, NULL, NULL)
          ON CONFLICT (candidate_id, skill_id) DO NOTHING;
        `;
        await client.query(sqlCandidateSkill, [candidateId, skillId]);
      }
    }

    await client.query('COMMIT');
    return extractionResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
