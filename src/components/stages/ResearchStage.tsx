import React from 'react';
import { CharacterSpec } from '../../types/pipeline';
import { BookOpen, Compass, Sliders, CheckCircle2 } from 'lucide-react';

interface ResearchStageProps {
  characterSpec: CharacterSpec;
  onUpdateSpec: (spec: Partial<CharacterSpec>) => void;
  fps: number;
  onSetFps: (fps: number) => void;
}

export const ResearchStage: React.FC<ResearchStageProps> = ({
  characterSpec,
  onUpdateSpec,
  fps,
  onSetFps,
}) => {
  return (
    <div className="space-y-6">
      {/* Director Skill Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Director: pipelines/character-animation/research-director
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Visual Style Bible & Motion Physics Invariants
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Establishes character proportions, cartoon line weight standards, frame cadence (12fps/24fps/60fps), and squash-and-stretch tolerance for deterministic local execution.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded text-xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Stage Researched</span>
        </div>
      </div>

      {/* Grid of Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proportion Bible Card */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Proportion Matrix
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Head-to-Body Scale Ratio</span>
                <span className="font-mono text-cyan-400">{characterSpec.proportions.headRatio}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.8"
                step="0.05"
                value={characterSpec.proportions.headRatio}
                onChange={(e) =>
                  onUpdateSpec({
                    proportions: {
                      ...characterSpec.proportions,
                      headRatio: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-slate-400">Exaggerated cartoon head ensures facial phonemes remain readable at small thumbnail viewports.</span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Outline Stroke Weight</span>
                <span className="font-mono text-cyan-400">{characterSpec.lineWeight}px</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="6"
                step="0.5"
                value={characterSpec.lineWeight}
                onChange={(e) => onUpdateSpec({ lineWeight: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Squash & Stretch Maximum Limit</span>
                <span className="font-mono text-cyan-400">±{Math.round(characterSpec.proportions.squashStretchLimit * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={characterSpec.proportions.squashStretchLimit}
                onChange={(e) =>
                  onUpdateSpec({
                    proportions: {
                      ...characterSpec.proportions,
                      squashStretchLimit: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Animation Cadence & Physics */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Timing & Frame Cadence
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Deterministic local animation computes every frame with analytical cubic easing polynomials.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {[
              { rate: 12, title: '12fps (On Twos)', desc: 'Classic hand-drawn snappy rhythm' },
              { rate: 24, title: '24fps (Film)', desc: 'Standard Disney cinematic cadence' },
              { rate: 30, title: '30fps (Broadcast)', desc: 'Smooth television standard' },
              { rate: 60, title: '60fps (Interactive)', desc: 'Ultra-fluid UI & web canvas' },
            ].map((option) => (
              <button
                key={option.rate}
                onClick={() => onSetFps(option.rate)}
                className={`p-2.5 rounded-lg text-left border transition-all ${
                  fps === option.rate
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">{option.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{option.desc}</div>
              </button>
            ))}
          </div>

          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
            <strong className="text-cyan-400">Invariants locked:</strong> No joint stretching without volume preservation. Zero cloud video generation latency.
          </div>
        </div>
      </div>
    </div>
  );
};
