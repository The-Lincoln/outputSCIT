import React from 'react';
import { SceneLayer, StageStatus } from '../../types/pipeline';
import { Layers, Eye, EyeOff, ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';

interface ScenePlanStageProps {
  sceneLayers: SceneLayer[];
  onToggleLayerVisibility: (layerId: string) => void;
  onUpdateLayerOpacity: (layerId: string, opacity: number) => void;
  stageStatus: StageStatus;
  onOpenGateModal: () => void;
}

export const ScenePlanStage: React.FC<ScenePlanStageProps> = ({
  sceneLayers,
  onToggleLayerVisibility,
  onUpdateLayerOpacity,
  stageStatus,
  onOpenGateModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Director: pipelines/character-animation/scene-director · APPROVAL GATE
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Scene Staging, Multiplane Parallax & Camera Framing
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Multiplane depth planes separate the character from background scenery, creating Disney-style cinematic parallax during camera movement.
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
              <span>Staging Approved</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 fill-current" />
              <span>Review Staging</span>
            </>
          )}
        </button>
      </div>

      {/* Layers List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Multiplane Staging Layers ({sceneLayers.length})
        </h3>

        <div className="space-y-2">
          {sceneLayers.map((layer) => (
            <div
              key={layer.id}
              className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{layer.name}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-[11px] font-mono text-cyan-400">
                    Depth Parallax: {layer.depthParallax}x
                  </span>
                </div>
                <p className="text-xs text-slate-400">{layer.description}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {/* Opacity slider */}
                <div className="flex items-center gap-2 w-36">
                  <span className="text-[10px] font-mono text-slate-500">Opacity:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={layer.opacity}
                    onChange={(e) => onUpdateLayerOpacity(layer.id, parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                    {Math.round(layer.opacity * 100)}%
                  </span>
                </div>

                {/* Visibility button */}
                <button
                  onClick={() => onToggleLayerVisibility(layer.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    layer.visible
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                  title={layer.visible ? 'Hide layer' : 'Show layer'}
                >
                  {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
