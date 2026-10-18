import React from 'react';
import { StageDefinition, StageId, StageStatus } from '../types/pipeline';
import { STAGE_DEFINITIONS } from '../data/initialProject';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

interface StageNavigatorProps {
  currentStageId: StageId;
  onSelectStage: (stageId: StageId) => void;
  stagesState: Record<StageId, { status: StageStatus }>;
}

export const StageNavigator: React.FC<StageNavigatorProps> = ({
  currentStageId,
  onSelectStage,
  stagesState,
}) => {
  return (
    <aside className="w-72 shrink-0 flex flex-col bg-[#0b0f17] border-r border-slate-800/80 overflow-y-auto">
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Pipeline Stages (11)
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-1.5 py-0.5 rounded">
            v1.0 LOCAL
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Deterministic 2D cartoon character production flow.
        </p>
      </div>

      {/* Stages List */}
      <div className="p-2 space-y-1">
        {STAGE_DEFINITIONS.map((def) => {
          const isActive = def.id === currentStageId;
          const stageState = stagesState[def.id];
          const status = stageState?.status || 'draft';

          return (
            <button
              key={def.id}
              onClick={() => onSelectStage(def.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex items-center justify-between group ${
                isActive
                  ? 'bg-slate-800/90 text-white shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Status Indicator Icon */}
                {status === 'approved' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : status === 'under_review' ? (
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                ) : status === 'changes_requested' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center shrink-0">
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                  </div>
                )}

                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {def.shortName}
                    </span>
                    {def.requiresApproval && (
                      <span
                        className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40"
                        title="Requires Checkpoint Sign-off"
                      >
                        GATE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {def.directorRole}
                  </div>
                </div>
              </div>

              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform shrink-0 ${
                  isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Bottom Protocol Info */}
      <div className="mt-auto p-3 m-2 rounded-lg bg-slate-950/80 border border-slate-800/60 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>meta/checkpoint-protocol</span>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-400">
          7 approval gates require formal sign-off. Changes in earlier stages invalidate downstream artifacts.
        </p>
      </div>
    </aside>
  );
};
