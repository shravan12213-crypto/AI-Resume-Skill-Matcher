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
  Plus,
  Edit2,
  Trash2
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
  const [newResumeFileUrl, setNewResumeFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ phone: '', location: '', summary: '' });
  const [error, setError] = useState<string | null>(null);
  const [candidateIdInput, setCandidateIdInput] = useState('1');

  const loadCandidateData = async (cid: number) => {
    setLoading(true);
    setError(null);
    try {
      const p = await api.getCandidateProfile(cid);
      setProfile(p);
      setEditForm({ phone: p?.phone || '', location: p?.location || '', summary: p?.summary || '' });
      const r = await api.getCandidateResumes(cid);
      setResumes(r);
      if (r.length > 0) {
        setSelectedResume(r[0]);
      } else {
        setSelectedResume(null);
      }
      setExtractedResult(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load candidate profile');
      setProfile(null);
      setResumes([]);
      setSelectedResume(null);
      setExtractedResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidateData(candidateId);
  }, [candidateId]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const p = await api.updateCandidateProfile(candidateId, editForm);
      setProfile(p);
      setIsEditingProfile(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleDeleteResume = async (resumeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.deleteResume(candidateId, resumeId);
      if (selectedResume?.resume_id === resumeId) setSelectedResume(null);
      await loadCandidateData(candidateId);
    } catch (err: any) {
      alert(err.message || 'Failed to delete resume');
    }
  };

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
    if (!newResumeFileName.trim() || !newResumeFileUrl.trim()) {
      alert('File name and File URL are required');
      return;
    }
    setUploading(true);
    try {
      await api.createResume(candidateId, {
        file_name: newResumeFileName,
        file_url: newResumeFileUrl,
        raw_text: newResumeText.trim() || undefined,
      });
      setNewResumeFileName('');
      setNewResumeFileUrl('');
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
            <span className="text-xs text-zinc-400 font-mono">Demo Candidate ID:</span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const id = parseInt(candidateIdInput, 10);
                if (!isNaN(id)) setCandidateId(id);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="number"
                min="1"
                value={candidateIdInput}
                onChange={(e) => setCandidateIdInput(e.target.value)}
                className="w-16 px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs text-center font-mono"
              />
              <Button type="submit" size="sm" className="h-7 px-3 text-[10px]">Load</Button>
            </form>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-900/50 rounded-2xl text-red-400 text-sm flex items-center justify-center">
          {error}
        </div>
      )}

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
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono">ID: #{profile?.candidate_id || candidateId}</span>
                    <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-zinc-400 hover:text-white">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <CardTitle className="text-lg text-white mt-2">
                  {profile?.name || `Candidate #${candidateId}`}
                </CardTitle>
                {!isEditingProfile && (
                  <CardDescription className="text-xs text-zinc-400">
                    {profile?.email || 'email@example.com'} • {profile?.phone || 'No phone'} • {profile?.location || 'Location not set'}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-xs text-zinc-400">
                {isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-xs placeholder-zinc-500"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-xs placeholder-zinc-500"
                    />
                    <textarea
                      placeholder="Summary"
                      value={editForm.summary}
                      onChange={(e) => setEditForm({...editForm, summary: e.target.value})}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 text-xs placeholder-zinc-500 h-20"
                    />
                    <Button type="submit" size="sm" className="w-full text-xs">Save Profile</Button>
                  </form>
                ) : (
                  profile?.summary && (
                    <p className="italic bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/60">
                      "{profile.summary}"
                    </p>
                  )
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
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col relative group ${
                        selectedResume?.resume_id === r.resume_id
                          ? 'bg-zinc-800/80 border-zinc-600 text-white shadow-sm'
                          : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs truncate max-w-[150px]">{r.file_name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] font-mono">#{r.resume_id}</Badge>
                          <button 
                            onClick={(e) => handleDeleteResume(r.resume_id, e)}
                            className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Resume"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1 font-mono flex items-center justify-between">
                        <span>{new Date(r.uploaded_at).toLocaleDateString()}</span>
                        {r.raw_text && <span className="text-emerald-500/70">Raw Text</span>}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Add Resume */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-zinc-200 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-zinc-400" />
                  <span>Add External Resume</span>
                </CardTitle>
                <CardDescription className="text-[10px] text-zinc-500 mt-1">
                  Provide a link to your resume and its text content for parsing.
                </CardDescription>
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
                    <input
                      type="url"
                      required
                      placeholder="File URL (e.g. https://storage/resume.pdf)"
                      value={newResumeFileUrl}
                      onChange={(e) => setNewResumeFileUrl(e.target.value)}
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
                    {uploading ? 'Saving...' : 'Save External Resume'}
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

                      {/* Projects */}
                      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                        <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <FolderGit2 className="w-4 h-4 text-indigo-400" />
                          <span>Projects</span>
                        </div>
                        <div className="space-y-1 text-xs text-zinc-400 font-mono">
                          {Array.isArray(extractedResult.projects) && extractedResult.projects.length > 0 ? (
                            extractedResult.projects.map((proj: any, idx: number) => (
                              <div key={idx} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                                <div className="text-zinc-200 font-medium">{proj.name}</div>
                                <div className="text-[11px] text-zinc-500">{proj.description}</div>
                              </div>
                            ))
                          ) : (
                            <span className="text-zinc-600">No projects extracted.</span>
                          )}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                        <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-indigo-400" />
                          <span>Certifications</span>
                        </div>
                        <div className="space-y-1 text-xs text-zinc-400 font-mono">
                          {Array.isArray(extractedResult.certifications) && extractedResult.certifications.length > 0 ? (
                            extractedResult.certifications.map((cert: any, idx: number) => (
                              <div key={idx} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                                <div className="text-zinc-200 font-medium">{cert.name}</div>
                              </div>
                            ))
                          ) : (
                            <span className="text-zinc-600">No certifications extracted.</span>
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
