import React, { useState } from 'react';
import {
  Lock,
  X,
  Send,
  AlertTriangle,
  ShieldAlert,
  Building,
  HardHat,
  Compass,
} from 'lucide-react';
import { useCivora } from '../../context/CivoraContext';
import { InternalDiscussion } from '../../types';

export const PrivateDiscussionModal: React.FC = () => {
  const {
    isPrivateDiscussionOpen,
    setIsPrivateDiscussionOpen,
    discussions,
    addInternalDiscussion,
    currentRole,
    currentUser,
    activeProject,
  } = useCivora();

  const [newMessage, setNewMessage] = useState('');
  const [priority, setPriority] = useState<InternalDiscussion['priority']>('Routine');

  if (!isPrivateDiscussionOpen) return null;

  // Customers should never access this
  if (currentRole === 'CUSTOMER') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full text-center">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-2">Access Restricted</h3>
          <p className="text-xs text-slate-400 mb-4">
            This channel contains confidential engineering calculations, contractor job costing, and proprietary site logs reserved strictly for site professionals.
          </p>
          <button
            onClick={() => setIsPrivateDiscussionOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
          >
            Return to Customer Portal
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    addInternalDiscussion(newMessage, priority);
    setNewMessage('');
    setPriority('Routine');
  };

  const getRoleIcon = (role: InternalDiscussion['authorRole']) => {
    switch (role) {
      case 'CONTRACTOR':
        return <HardHat className="w-3.5 h-3.5 text-amber-400" />;
      case 'ENGINEER':
        return <Compass className="w-3.5 h-3.5 text-emerald-400" />;
      case 'BUILDER':
        return <Building className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-amber-800/40 rounded-2xl w-full max-w-2xl h-[620px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Confidential Internal Site Memo</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                  Private Channel
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Site coordination between Contractor, Engineer & Developer · Hidden from Customer Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPrivateDiscussionOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Discussions List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {discussions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No internal memos recorded yet for {activeProject.name}.
            </div>
          ) : (
            discussions.map((d) => (
              <div
                key={d.id}
                className="bg-slate-800/70 border border-slate-700/70 rounded-xl p-4 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(d.authorRole)}
                    <span className="font-bold text-slate-200">{d.authorName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400 text-[11px]">{d.authorTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.priority === 'Action Required' && (
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-medium flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Action Required
                      </span>
                    )}
                    {d.priority === 'Urgent' && (
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-medium">
                        Urgent
                      </span>
                    )}
                    <span className="text-slate-400 text-[10px]">{d.timestamp}</span>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-[13px]">
                  {d.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Posting as: <strong className="text-slate-200">{currentUser?.name}</strong> ({currentRole})</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Priority:</span>
              {(['Routine', 'Urgent', 'Action Required'] as InternalDiscussion['priority'][]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    priority === p
                      ? p === 'Action Required'
                        ? 'bg-rose-600 text-white font-medium'
                        : p === 'Urgent'
                        ? 'bg-amber-600 text-white font-medium'
                        : 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <textarea
              rows={2}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Record internal technical note, formwork correction, or structural coordination memo..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Memo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
