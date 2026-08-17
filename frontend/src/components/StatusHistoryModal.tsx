// frontend/src/components/StatusHistoryModal.tsx
import React, { useEffect, useState } from 'react';
import { X, History, ArrowRight, Clock, Loader2, ShieldCheck } from 'lucide-react';
import { StatusHistory } from '../types';
import { api } from '../services/api';

interface StatusHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number | null;
}

export const StatusHistoryModal: React.FC<StatusHistoryModalProps> = ({
  isOpen,
  onClose,
  applicationId,
}) => {
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && applicationId) {
      setLoading(true);
      api
        .getApplicationHistory(applicationId)
        .then((res) => setHistory(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, applicationId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <History className="w-5 h-5 text-indigo-400" />
              <span>Application Status Audit Trail</span>
            </h2>
            <p className="text-xs text-slate-400">
              Populated by PostgreSQL trigger <code className="text-indigo-400 font-mono">trg_application_status_history</code>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              <span className="text-xs">Reading trigger audit records...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p>No status modifications recorded yet.</p>
              <p className="mt-1">Updating an applicant's status will automatically generate an immutable audit row.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
              {history.map((h) => (
                <div key={h.history_id} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-slate-900" />

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                        {h.old_status || 'Initial'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase font-semibold text-[10px] border border-indigo-500/30">
                        {h.new_status}
                      </span>
                    </div>

                    <div className="flex items-center text-[11px] text-slate-500 space-x-1.5 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(h.changed_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
