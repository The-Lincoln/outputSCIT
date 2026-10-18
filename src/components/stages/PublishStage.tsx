import React, { useState } from 'react';
import {
  CharacterSpec,
  BoneNode,
  Keyframe,
  TimelineTrack,
  StageStatus,
} from '../../types/pipeline';
import {
  FileCode,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Code2,
  Package,
} from 'lucide-react';

interface PublishStageProps {
  characterSpec: CharacterSpec;
  bones: Record<string, BoneNode>;
  keyframes: Keyframe[];
  tracks: TimelineTrack[];
  fps: number;
  totalFrames: number;
  stageStatus: StageStatus;
  onOpenGateModal: () => void;
}

export const PublishStage: React.FC<PublishStageProps> = ({
  characterSpec,
  bones,
  keyframes,
  tracks,
  fps,
  totalFrames,
  stageStatus,
  onOpenGateModal,
}) => {
  const [activeTab, setActiveTab] = useState<'remotion' | 'hyperframes' | 'svg' | 'canvas'>('remotion');
  const [copied, setCopied] = useState(false);

  // Generate Remotion React Component Code
  const remotionCode = `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// Character: ${characterSpec.name} (${characterSpec.archetype})
// Deterministic Remotion Composition
export const PipCharacterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Root Bob & Translation
  const rootY = interpolate(frame, [0, 12, 24, 48], [0, 14, -8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Torso Rotation
  const torsoAngle = interpolate(frame, [0, 12, 24, 48], [-90, -84, -92, -90]);

  // Right Arm Wave
  const waveArmAngle = interpolate(frame, [0, 12, 24, 32, 40, 48], [20, -40, -98, -40, -75, 20]);

  return (
    <div style={{ flex: 1, backgroundColor: '#0b0f17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 520 520" width={520} height={520}>
        {/* Dynamic Contact Shadow */}
        <ellipse
          cx={260}
          cy={460}
          rx={Math.max(30, 65 - rootY * 0.5)}
          ry={14}
          fill="rgba(3, 7, 18, 0.45)"
        />
        {/* Torso & Head Rig */}
        <g transform={\`translate(260, \${310 + rootY}) rotate(\${torsoAngle + 90})\`}>
          {/* Suit body */}
          <rect x={-30} y={-40} width={60} height={68} rx={16} fill="${characterSpec.palette.primary}" stroke="${characterSpec.palette.outline}" strokeWidth={3} />
          {/* Helmet */}
          <circle cx={0} cy={-56} r={46} fill="${characterSpec.palette.skin}" stroke="${characterSpec.palette.outline}" strokeWidth={3.5} />
          {/* Visor */}
          <rect x={-36} y={-76} width={72} height={46} rx={22} fill="${characterSpec.palette.accent}" stroke="${characterSpec.palette.outline}" strokeWidth={3} />
        </g>
        {/* Wave Arm */}
        <g transform={\`translate(280, \${270 + rootY}) rotate(\${waveArmAngle})\`}>
          <line x1={0} y1={0} x2={40} y2={0} stroke="${characterSpec.palette.primary}" strokeWidth={16} strokeLinecap="round" />
          <circle cx={40} cy={0} r={12} fill="${characterSpec.palette.skin}" stroke="${characterSpec.palette.outline}" strokeWidth={3} />
        </g>
      </svg>
    </div>
  );
};`;

  // Generate HyperFrames JSON schema
  const hyperFramesBundle = {
    schemaVersion: 'hyperframes/1.0',
    generator: 'Pipelines Character Animation Studio',
    deterministic: true,
    metadata: {
      character: characterSpec.name,
      universe: characterSpec.universe,
      fps,
      totalFrames,
      durationSeconds: totalFrames / fps,
    },
    bones: Object.values(bones).map((b) => ({
      id: b.id,
      name: b.name,
      parentId: b.parentId,
      length: b.length,
      defaultAngle: b.defaultAngle,
      minAngle: b.minAngle,
      maxAngle: b.maxAngle,
      pivotOffset: b.pivotOffset,
    })),
    tracks: tracks.map((t) => ({
      id: t.id,
      name: t.name,
      type: t.type,
      keyframeCount: keyframes.filter((k) => k.trackId === t.id).length,
    })),
    keyframes: keyframes,
  };

  const hyperFramesJson = JSON.stringify(hyperFramesBundle, null, 2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([hyperFramesJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${characterSpec.id}-hyperframes-timeline.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Director: pipelines/character-animation/publish-director · FINAL APPROVAL GATE
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Multi-Runtime Publisher & Code Exporter
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Compile the completed animation into standalone Remotion React components, HyperFrames JSON bundles, or web-native SVG/Canvas modules.
          </p>
        </div>

        <button
          onClick={onOpenGateModal}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            stageStatus === 'approved'
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
              : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{stageStatus === 'approved' ? 'Production Approved' : 'Sign Off Final Gate'}</span>
        </button>
      </div>

      {/* Runtime Code Viewer Tabs */}
      <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
          {/* Format Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg">
            <button
              onClick={() => setActiveTab('remotion')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'remotion'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Remotion Component (.tsx)
            </button>
            <button
              onClick={() => setActiveTab('hyperframes')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'hyperframes'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HyperFrames Timeline (.json)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {activeTab === 'hyperframes' && (
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </button>
            )}

            <button
              onClick={() => handleCopy(activeTab === 'remotion' ? remotionCode : hyperFramesJson)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
            </button>
          </div>
        </div>

        {/* Code Content Area */}
        <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-cyan-300 overflow-x-auto max-h-96 leading-relaxed select-all">
          {activeTab === 'remotion' ? remotionCode : hyperFramesJson}
        </pre>
      </div>
    </div>
  );
};
