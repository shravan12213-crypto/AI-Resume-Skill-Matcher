// frontend/src/components/StatusHistoryModal.tsx
import React, { useEffect, useState } from 'react';
import { X, History, ArrowRight, Clock, Loader2, ShieldCheck } from 'lucide-react';
import { StatusHistory } from '../types';
import { api } from '../services/api';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/90">
          <div>
            <h2 className="text-base font-semibold text-white font-display flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-300" />
              <span>Application Audit Trail</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Triggered via <code className="text-zinc-200 font-mono text-[11px]">trg_application_status_history</code>
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
            <X className="w-4 h-4 text-zinc-400" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center text-zinc-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              <span className="text-xs">Reading trigger audit records...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              <ShieldCheck className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
              <p className="font-medium text-zinc-300">No status modifications recorded yet.</p>
              <p className="mt-1">Updating an applicant's status will automatically record an immutable row.</p>
            </div>
          ) : (
            <div className="relative border-l border-zinc-800 ml-3 pl-5 space-y-5">
              {history.map((h) => (
                <div key={h.history_id} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-300 ring-4 ring-zinc-900" />

                  <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                        {h.old_status || 'Initial'}
                      </Badge>
                      <ArrowRight className="w-3 h-3 text-zinc-500" />
                      <Badge variant="default" className="text-[10px] uppercase font-mono">
                        {h.new_status}
                      </Badge>
                    </div>

                    <div className="flex items-center text-[11px] text-zinc-500 gap-1.5 pt-0.5">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{new Date(h.changed_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/60 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close History
          </Button>
        </div>
      </div>
    </div>
  );
};
