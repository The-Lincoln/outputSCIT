import React from 'react';
import { Pose, StageStatus } from '../../types/pipeline';
import { Film, CheckCircle2, ShieldAlert, Sparkles, Play } from 'lucide-react';

interface SampleStageProps {
  stageStatus: StageStatus;
  onOpenGateModal: () => void;
  poses: Pose[];
  onApplyPose: (pose: Pose) => void;
  currentFrame: number;
  totalFrames: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const SampleStage: React.FC<SampleStageProps> = ({
  stageStatus,
  onOpenGateModal,
  poses,
  onApplyPose,
  currentFrame,
  totalFrames,
  isPlaying,
  onTogglePlay,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Stage 3: Sample Approval · APPROVAL GATE
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Sample Key Motion Slice & Silhouette Audit
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            A 2.0-second motion slice (48 frames) to audit joint deformation, silhouette clarity, and facial phoneme snap before writing full dialogue scripts.
          </p>
        </div>

        <button
          onClick={onOpenGateModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            stageStatus === 'approved'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400'
          }`}
        >
          {stageStatus === 'approved' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sample Approved</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 fill-current" />
              <span>Review Sample</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Slice Verification Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Sample Motion Slice (2.0s Loop)
              </h3>
            </div>
            <button
              onClick={onTogglePlay}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-cyan-500 text-slate-950 rounded hover:bg-cyan-400 transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isPlaying ? 'PAUSE' : 'PLAY SLICE'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex justify-between font-mono text-[11px]">
              <span>Sample Duration:</span>
              <span className="text-cyan-400">48 Frames / 2.0 Seconds</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span>Test Action:</span>
              <span className="text-cyan-400">Walk Contact + Wave Peak</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span>Joint Separation:</span>
              <span className="text-emerald-400 font-bold">0.00px (Zero Gaps)</span>
            </div>
          </div>
        </div>

        {/* Extreme Angle Verification Tests */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Sample Joint Extreme Poses
          </h3>
          <p className="text-xs text-slate-400">
            Click to snap Pip into extreme motion test poses to verify joint deformation:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {poses.slice(0, 4).map((pose) => (
              <button
                key={`sample-${pose.id}`}
                onClick={() => onApplyPose(pose)}
                className="p-2 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left text-xs transition-colors"
              >
                <div className="font-semibold text-slate-200 truncate">{pose.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 capitalize">{pose.category}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
