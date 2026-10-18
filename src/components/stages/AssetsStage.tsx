import React, { useState } from 'react';
import { CharacterPalette, StageStatus } from '../../types/pipeline';
import { Package, ShieldAlert, CheckCircle2, Layers, Crosshair } from 'lucide-react';

interface AssetsStageProps {
  palette: CharacterPalette;
  stageStatus: StageStatus;
  onOpenGateModal: () => void;
}

export const AssetsStage: React.FC<AssetsStageProps> = ({
  palette,
  stageStatus,
  onOpenGateModal,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<string>('helmet');

  const assetsList = [
    { id: 'helmet', name: 'Astronaut Helmet & Ears', zIndex: 10, pivot: 'Bottom Center (0, 48)', drawCall: 'SVG Arc & Radial Shading' },
    { id: 'visor', name: 'Digital Visor Glass', zIndex: 12, pivot: 'Center (0, 0)', drawCall: 'Curved Screen Glass + Eyes' },
    { id: 'antenna', name: 'Visor Communicator Antenna', zIndex: 14, pivot: 'Base (12, -24)', drawCall: 'Gold Bulb + Sensor Mast' },
    { id: 'torso', name: 'Suit Torso & Compass Emblem', zIndex: 8, pivot: 'Root Pelvis (0, 0)', drawCall: 'Cyan Suit + Shaded Gradient' },
    { id: 'belt', name: 'Robotic Utility Belt', zIndex: 9, pivot: 'Root Center', drawCall: 'Slate Strap + Gold Buckle' },
    { id: 'jetpack', name: 'Backpack Orbital Thruster', zIndex: 2, pivot: 'Torso Mid', drawCall: 'Dual Thrusters + Blue Glow' },
    { id: 'arm_upper', name: 'Upper Suit Arm', zIndex: 11, pivot: 'Shoulder Socket (0, 0)', drawCall: 'Reinforced 22px Vector Stroke' },
    { id: 'forearm_glove', name: 'Forearm & Space Glove', zIndex: 13, pivot: 'Elbow Hinge', drawCall: 'Pearl White Glove + Grip Thumb' },
    { id: 'thigh', name: 'Suit Thigh', zIndex: 4, pivot: 'Hip Socket', drawCall: 'Astro Cyan 20px Stroke' },
    { id: 'shin_boot', name: 'Shin & Magnetic Moon Boot', zIndex: 5, pivot: 'Knee Joint', drawCall: 'Solar Gold Boot + Tread Pad' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Director: pipelines/character-animation/asset-director · APPROVAL GATE
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Componentized Vector Slices & Anchor Sockets
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Every character part is decomposed into clean, isolated SVG vector shapes with predefined pivot anchors and z-index sorting.
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
              <span>Assets Approved</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 fill-current" />
              <span>Review Assets</span>
            </>
          )}
        </button>
      </div>

      {/* Asset Slices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parts Slices Cards */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Vector Asset Slices ({assetsList.length})
            </h3>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {assetsList.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                  selectedAsset === asset.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{asset.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{asset.drawCall}</div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/40">
                  Z:{asset.zIndex}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Isolated Vector Slice Preview Box */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span>Isolated Anchor Inspection</span>
              </h3>
              <span className="text-xs font-mono text-amber-400 capitalize">{selectedAsset}</span>
            </div>

            {/* Visual SVG Mini Canvas */}
            <div className="w-full h-44 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* Display selected slice */}
              {selectedAsset === 'helmet' && (
                <svg viewBox="0 0 120 120" className="w-28 h-28">
                  <polygon points="16,36 32,4 48,22" fill={palette.primary} stroke={palette.outline} strokeWidth="3" />
                  <polygon points="72,22 88,4 104,36" fill={palette.primary} stroke={palette.outline} strokeWidth="3" />
                  <circle cx="60" cy="60" r="44" fill={palette.skin} stroke={palette.outline} strokeWidth="3.5" />
                  <rect x="26" cy="40" width="68" height="42" rx="20" fill={palette.accent} stroke={palette.outline} strokeWidth="2.5" />
                  {/* Anchor Point Red Cross */}
                  <circle cx="60" cy="104" r="4" fill="#ef4444" />
                </svg>
              )}

              {selectedAsset === 'visor' && (
                <svg viewBox="0 0 120 120" className="w-28 h-28">
                  <rect x="15" y="35" width="90" height="52" rx="24" fill="#0284c7" stroke={palette.outline} strokeWidth="3" />
                  <ellipse cx="44" cy="60" rx="8" ry="9" fill="#ffffff" />
                  <ellipse cx="76" cy="60" rx="8" ry="9" fill="#ffffff" />
                  <circle cx="45" cy="60" r="4" fill="#0c4a6e" />
                  <circle cx="77" cy="60" r="4" fill="#0c4a6e" />
                  <circle cx="60" cy="60" r="4" fill="#ef4444" />
                </svg>
              )}

              {selectedAsset !== 'helmet' && selectedAsset !== 'visor' && (
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-400 font-mono text-xs mb-2">
                    SVG
                  </div>
                  <div className="text-xs text-slate-300 font-medium">Decomposed Sprite Slice</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Vector socket anchor centered</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 mt-3">
            <strong className="text-cyan-400">Anchor Verified:</strong> Sockets snap to parent bone pivot with sub-pixel zero-drift alignment.
          </div>
        </div>
      </div>
    </div>
  );
};
