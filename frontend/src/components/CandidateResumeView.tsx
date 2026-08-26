// frontend/src/components/CandidateResumeView.tsx
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  Loader2,
  Play,
  User,
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';

export const CandidateResumeView: React.FC = () => {
  const [candidateId, setCandidateId] = useState<number>(1);
  const [profile, setProfile] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedResult, setExtractedResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newResumeText, setNewResumeText] = useState('');
  const [newResumeFileName, setNewResumeFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadCandidateData = async (cid: number) => {
    setLoading(true);
    try {
      const p = await api.getCandidateProfile(cid);
      setProfile(p);
      const r = await api.getCandidateResumes(cid);
      setResumes(r);
      if (r.length > 0) {
        setSelectedResume(r[0]);
      } else {
        setSelectedResume(null);
      }
      setExtractedResult(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidateData(candidateId);
  }, [candidateId]);

  const handleExtract = async () => {
    if (!selectedResume) return;
    setExtracting(true);
    try {
      const res = await api.extractResumeData(candidateId, selectedResume.resume_id);
      setExtractedResult(res);
      // Reload profile to refresh skills
      const p = await api.getCandidateProfile(candidateId);
      setProfile(p);
    } catch (err: any) {
      alert(err.message || 'Extraction failed');
    } finally {
      setExtracting(false);
    }
  };

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResumeFileName.trim()) return;
    setUploading(true);
    try {
      await api.createResume(candidateId, {
        file_name: newResumeFileName,
        file_url: `https://storage.skillmatch.dev/resumes/${newResumeFileName}`,
        raw_text: newResumeText || 'Alice Candidate\nSenior Backend Engineer\nSkills: Python, PostgreSQL, Redis, Docker\nExperience: 5 years at CloudCorp building relational backend services\nEducation: BS in Computer Science from MIT',
      });
      setNewResumeFileName('');
      setNewResumeText('');
      await loadCandidateData(candidateId);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Section */}
      <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Structured AI ETL Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display flex items-center gap-2.5">
              <FileText className="w-7 h-7 text-zinc-200" />
              <span>AI Resume Parsing & Extraction</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              OpenAI extracts structured JSON entities (education, experience, projects, skills) from plain resume text, and PostgreSQL transactionally normalizes skills into relational tables.
            </p>
          </div>

          {/* Candidate Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">Candidate ID:</span>
            {[1, 2, 3].map((id) => (
              <button
                key={id}
                onClick={() => setCandidateId(id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  candidateId === id
                    ? 'bg-zinc-100 text-zinc-950 font-bold shadow'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                #{id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-400 mb-2" />
          <p className="text-xs font-medium">Loading candidate records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Candidate Profile & Resume List */}
          <div className="space-y-6">
            {/* Candidate Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    Candidate Profile
                  </Badge>
                  <span className="text-xs text-zinc-500 font-mono">ID: #{profile?.candidate_id || candidateId}</span>
                </div>
                <CardTitle className="text-lg text-white mt-2">
                  {profile?.name || `Candidate #${candidateId}`}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  {profile?.email || 'email@example.com'} • {profile?.location || 'Location not set'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs text-zinc-400">
                {profile?.summary && (
                  <p className="italic bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/60">
                    "{profile.summary}"
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Resume Archive */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-zinc-200 flex items-center justify-between">
                  <span>Uploaded Resumes ({resumes.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {resumes.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-2">No resumes on file.</p>
                ) : (
                  resumes.map((r) => (
                    <div
                      key={r.resume_id}
                      onClick={() => setSelectedResume(r)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedResume?.resume_id === r.resume_id
                          ? 'bg-zinc-800/80 border-zinc-600 text-white shadow-sm'
                          : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs truncate max-w-[180px]">{r.file_name}</span>
                        <Badge variant="secondary" className="text-[10px] font-mono">#{r.resume_id}</Badge>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                        {new Date(r.uploaded_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Upload Test Resume */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-zinc-200 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-zinc-400" />
                  <span>Upload Plaintext Resume</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleCreateResume} className="space-y-3 text-xs">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="File Name (e.g. resume_2026.pdf)"
                      value={newResumeFileName}
                      onChange={(e) => setNewResumeFileName(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-xs placeholder-zinc-500"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={4}
                      placeholder="Paste raw resume text here for AI extraction..."
                      value={newResumeText}
                      onChange={(e) => setNewResumeText(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-xs placeholder-zinc-500"
                    />
                  </div>
                  <Button type="submit" size="sm" disabled={uploading} className="w-full text-xs">
                    {uploading ? 'Uploading...' : 'Save New Resume'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (2 cols): Selected Resume & Extraction Inspector */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="flex flex-col h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800/60">
                <div>
                  <CardTitle className="text-base text-zinc-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <span>{selectedResume ? selectedResume.file_name : 'No Resume Selected'}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-0.5">
                    {selectedResume ? `Uploaded ${new Date(selectedResume.uploaded_at).toLocaleString()}` : 'Select a resume from the left panel'}
                  </CardDescription>
                </div>

                {selectedResume && (
                  <Button
                    onClick={handleExtract}
                    disabled={extracting}
                    size="sm"
                    className="gap-2 shadow-lg"
                  >
                    {extracting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting AI JSON...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Run AI Extraction</span>
                      </>
                    )}
                  </Button>
                )}
              </CardHeader>

              <CardContent className="p-6 space-y-6 flex-1">
                {/* Raw Text Box */}
                {selectedResume?.raw_text && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Raw Resume Text
                    </span>
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {selectedResume.raw_text}
                    </div>
                  </div>
                )}

                {/* AI Extracted Result */}
                {extractedResult ? (
                  <div className="space-y-4 pt-2 border-t border-zinc-800/60 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Extracted Structured Entities (Saved to PostgreSQL)</span>
                      </h3>
                      <Badge variant="success" className="text-[10px] font-mono">
                        Saved in `resume_extracted_data`
                      </Badge>
                    </div>

                    {/* Education & Experience Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Education */}
                      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                        <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-indigo-400" />
                          <span>Education</span>
                        </div>
                        <div className="space-y-1 text-xs text-zinc-400 font-mono">
                          {Array.isArray(extractedResult.education) && extractedResult.education.length > 0 ? (
                            extractedResult.education.map((edu: any, idx: number) => (
                              <div key={idx} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                                <div className="text-zinc-200 font-medium">{edu.degree} in {edu.field}</div>
                                <div className="text-[11px] text-zinc-500">{edu.institution} ({edu.start_year || ''} - {edu.end_year || ''})</div>
                              </div>
                            ))
                          ) : (
                            <span className="text-zinc-600">No education extracted.</span>
                          )}
                        </div>
                      </div>

                      {/* Work Experience */}
                      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                        <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-indigo-400" />
                          <span>Work Experience</span>
                        </div>
                        <div className="space-y-1 text-xs text-zinc-400 font-mono">
                          {Array.isArray(extractedResult.experience) && extractedResult.experience.length > 0 ? (
                            extractedResult.experience.map((exp: any, idx: number) => (
                              <div key={idx} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                                <div className="text-zinc-200 font-medium">{exp.role} @ {exp.company}</div>
                                <div className="text-[11px] text-zinc-500">{exp.years || 0} years</div>
                              </div>
                            ))
                          ) : (
                            <span className="text-zinc-600">No work experience extracted.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Normalized Skills */}
                    <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                      <div className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>Normalized Candidate Skills (`candidate_skills`)</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {Array.isArray(extractedResult.skills) && extractedResult.skills.length > 0 ? (
                          extractedResult.skills.map((sk: string, idx: number) => (
                            <Badge key={idx} variant="matched">
                              <span>✓</span>
                              <span>{sk}</span>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-600">No skills parsed.</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border border-dashed border-zinc-800 text-center text-zinc-500 space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto text-zinc-700" />
                    <p className="text-xs">Click "Run AI Extraction" to parse this resume with OpenAI and view normalized entities.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
