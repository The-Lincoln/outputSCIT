import React from 'react';
import { StageStatus } from '../../types/pipeline';
import { FileText, ShieldAlert, CheckCircle2, PackageCheck, Zap } from 'lucide-react';

interface ProposalStageProps {
  stageStatus: StageStatus;
  onOpenGateModal: () => void;
}

export const ProposalStage: React.FC<ProposalStageProps> = ({
  stageStatus,
  onOpenGateModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Director: pipelines/character-animation/proposal-director · APPROVAL GATE
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Production Proposal & Character Reuse Charter
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Formal agreement governing the modular cartoon character specification, multi-scene asset reuse, and mathematical local motion runtime commitments.
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
              <span>Gate Signed Off</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 fill-current" />
              <span>Checkpoint Review</span>
            </>
          )}
        </button>
      </div>

      {/* Deliverable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <PackageCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-200 font-display">
            100% Deterministic Local Engine
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminates non-deterministic video generation. Characters are guaranteed to maintain exact proportions, line weights, and limb socket connections across every frame.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-200 font-display">
            Multi-Runtime Compatibility
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Assets compile simultaneously to web-native SVG vector trees, hardware-accelerated Canvas 2D contexts, Remotion video renderers, and HyperFrames JSON bundles.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-200 font-display">
            Episodic Character Reusability
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rig skeletons, facial viseme palettes, and pose libraries are decoupled from background staging, enabling immediate reuse in infinite story episodes.
          </p>
        </div>
      </div>
    </div>
  );
};
