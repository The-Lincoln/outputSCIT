import React from 'react';
import { SceneLayer } from '../../types/pipeline';
import { Layers, Sun, Sparkles, CheckCircle2 } from 'lucide-react';

interface ComposeStageProps {
  sceneLayers: SceneLayer[];
  fps: number;
}

export const ComposeStage: React.FC<ComposeStageProps> = ({
  sceneLayers,
  fps,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Director: pipelines/character-animation/compose-director
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Layer Compositing, Ambient Lighting & Shadow Depth
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Blends the multiplane background, character vector plane, dynamic contact shadow deformation, and foreground HUD viewfinder.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded text-xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Compositor Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Layer Stack Staging */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Compositing Stack (Bottom to Top)
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">Layer 1: Deep Cosmic Nebula</span>
                <div className="text-[10px] text-slate-500">Parallax factor: 0.10x</div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Backdrop</span>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">Layer 2: Moon Horizon</span>
                <div className="text-[10px] text-slate-500">Parallax factor: 0.35x</div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Midground</span>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-cyan-500/40 flex items-center justify-between">
              <div>
                <span className="font-semibold text-cyan-300">Layer 3: Character Rig Plane + Shadow</span>
                <div className="text-[10px] text-cyan-500/80">Parallax factor: 1.00x (Primary focus)</div>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">Focal Plane</span>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200">Layer 4: Viewfinder HUD Reticles</span>
                <div className="text-[10px] text-slate-500">Parallax factor: 1.40x</div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Foreground</span>
            </div>
          </div>
        </div>

        {/* Dynamic Shadow & Lighting Properties */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Dynamic Contact Shadow Physics
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The contact shadow is not a static circle; it recalculates squashing geometry proportional to character vertical hop:
          </p>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">Shadow Baseline Y:</span>
              <span className="text-cyan-400">460px (Ground Plane)</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">Squash Formula:</span>
              <span className="text-cyan-400">Rx = 65 × (1 - RootY × 0.015)</span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-slate-400">Luminance Dropoff:</span>
              <span className="text-cyan-400">Opacity fades as Pip jumps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
