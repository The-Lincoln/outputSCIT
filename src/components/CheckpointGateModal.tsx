import React, { useState } from 'react';
import { StageDefinition, StageStatus, ReviewLogEntry } from '../types/pipeline';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  ShieldAlert,
  Send,
  History,
} from 'lucide-react';

interface CheckpointGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageDef: StageDefinition;
  stageStatus: StageStatus;
  criteria: Array<{ id: string; label: string; passed: boolean; notes?: string }>;
  onToggleCriteria: (criteriaId: string) => void;
  onApproveStage: (notes: string) => void;
  onRequestRevisions: (notes: string) => void;
  onSubmitForReview: (notes: string) => void;
  reviewHistory: ReviewLogEntry[];
}

export const CheckpointGateModal: React.FC<CheckpointGateModalProps> = ({
  isOpen,
  onClose,
  stageDef,
  stageStatus,
  criteria,
  onToggleCriteria,
  onApproveStage,
  onRequestRevisions,
  onSubmitForReview,
  reviewHistory,
}) => {
  const [feedbackNote, setFeedbackNote] = useState('');
  const [reviewerName, setReviewerName] = useState('Executive Producer');

  if (!isOpen) return null;

  const allPassed = criteria.every((c) => c.passed);
  const relevantHistory = reviewHistory.filter((h) => h.stageId === stageDef.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0e1422] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Checkpoint Protocol · {stageDef.directorRole}
              </div>
              <h2 className="text-base font-bold text-white font-display">
                Gate Approval: {stageDef.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stage Summary */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="text-slate-400 font-medium mb-1">Director Skill Path</div>
            <div className="font-mono text-cyan-300 text-[11px] mb-2">{stageDef.directorSkill}</div>
            <p className="text-slate-300 leading-relaxed">{stageDef.description}</p>
          </div>

          {/* meta/reviewer Criteria Audit Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                meta/reviewer Validation Checklist
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {criteria.filter((c) => c.passed).length}/{criteria.length} Verified
              </span>
            </div>

            <div className="space-y-2">
              {criteria.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleCriteria(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                    item.passed
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.passed}
                    onChange={() => onToggleCriteria(item.id)}
                    className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className={item.passed ? 'font-medium' : ''}>{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Decision Notes Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2">
              Executive Reviewer Decision & Feedback
            </label>
            <textarea
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              placeholder="Provide constructive director feedback, sign-off notes, or required revisions..."
              className="w-full h-24 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Audit History Log */}
          {relevantHistory.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-2">
                <History className="w-3.5 h-3.5" />
                <span>Stage Audit History</span>
              </div>
              <div className="space-y-2">
                {relevantHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded bg-slate-950/50 border border-slate-800/80 text-[11px]"
                  >
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="font-semibold text-slate-300">{entry.reviewer}</span>
                      <span className="font-mono">{entry.timestamp}</span>
                    </div>
                    <p className="text-slate-300">{entry.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/80">
          <button
            onClick={() => {
              onRequestRevisions(feedbackNote || 'Adjustments requested by director.');
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Request Revisions</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSubmitForReview(feedbackNote || 'Submitted for executive review.');
                onClose();
              }}
              className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Submit for Review
            </button>

            <button
              onClick={() => {
                onApproveStage(feedbackNote || 'Stage criteria verified and signed off.');
                onClose();
              }}
              disabled={!allPassed}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                allPassed
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sign Off & Approve Stage</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
