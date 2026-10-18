import React from 'react';
import { AnimationRuntime, StageId } from '../types/pipeline';
import { Clapperboard, Sparkles, CheckCircle2, AlertCircle, FileCode } from 'lucide-react';

interface ExecutiveProducerBarProps {
  projectTitle: string;
  currentStageId: StageId;
  stageName: string;
  stageNumber: number;
  stageStatus: string;
  runtime: AnimationRuntime;
  onSelectRuntime: (runtime: AnimationRuntime) => void;
  onOpenCheckpointModal: () => void;
  requiresApproval: boolean;
}

export const ExecutiveProducerBar: React.FC<ExecutiveProducerBarProps> = ({
  projectTitle,
  stageName,
  stageNumber,
  stageStatus,
  runtime,
  onSelectRuntime,
  onOpenCheckpointModal,
  requiresApproval,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0b0f17] border-b border-slate-800/80 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
          <Clapperboard className="w-4 h-4 text-slate-950" />
        </div>
        <span className="text-base font-bold tracking-tight text-white font-display">
          Pipelines Studio
        </span>
      </div>

      {/* Zone 2: Navigation & Stage Context */}
      <nav className="hidden lg:flex items-center gap-3 text-xs text-slate-400">
        <span className="text-slate-300 font-medium truncate max-w-xs">{projectTitle}</span>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <span className="text-cyan-400 font-mono font-medium">Stage {stageNumber}/11: {stageName}</span>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <span className="text-slate-400 font-mono">
          Status: {stageStatus === 'approved' ? (
            <span className="text-emerald-400 font-medium">Approved</span>
          ) : stageStatus === 'under_review' ? (
            <span className="text-amber-400 font-medium">Under Review</span>
          ) : (
            <span className="text-slate-300 font-medium">In Progress</span>
          )}
        </span>
      </nav>

      {/* Zone 3: Interactive Controls (Runtime Selector & Checkpoint Action) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Runtime Selector Segmented Control */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => onSelectRuntime('svg')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              runtime === 'svg'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SVG Rig
          </button>
          <button
            onClick={() => onSelectRuntime('canvas')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              runtime === 'canvas'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Canvas 2D
          </button>
          <button
            onClick={() => onSelectRuntime('remotion')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              runtime === 'remotion'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Remotion / JSON
          </button>
        </div>

        {/* Checkpoint Gate Action Button */}
        {requiresApproval && (
          <button
            onClick={onOpenCheckpointModal}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              stageStatus === 'approved'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
            }`}
          >
            {stageStatus === 'approved' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gate Approved</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 fill-current" />
                <span>Review Checkpoint</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
