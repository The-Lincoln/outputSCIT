import React, { useState } from 'react';
import { BoneNode, CharacterPalette, PhonemeViseme, SceneLayer, AnimationRuntime } from '../../types/pipeline';
import { CharacterSvgRig } from './CharacterSvgRig';
import { CharacterCanvasRig } from './CharacterCanvasRig';
import { Eye, EyeOff, Layers, ZoomIn, ZoomOut, RotateCcw, Activity } from 'lucide-react';

interface CharacterViewportProps {
  runtime: AnimationRuntime;
  bones: Record<string, BoneNode>;
  rootOffset?: { x: number; y: number };
  palette: CharacterPalette;
  viseme?: PhonemeViseme;
  eyeExpression?: 'open' | 'blink' | 'squint' | 'wide' | 'wink';
  showBonesOverlay: boolean;
  onToggleBones: () => void;
  showOnionSkin: boolean;
  onToggleOnionSkin: () => void;
  selectedBoneId: string | null;
  onSelectBone: (boneId: string) => void;
  sceneLayers: SceneLayer[];
  fps: number;
  currentFrame: number;
}

export const CharacterViewport: React.FC<CharacterViewportProps> = ({
  runtime,
  bones,
  rootOffset = { x: 0, y: 0 },
  palette,
  viseme = 'rest',
  eyeExpression = 'open',
  showBonesOverlay,
  onToggleBones,
  showOnionSkin,
  onToggleOnionSkin,
  selectedBoneId,
  onSelectBone,
  sceneLayers,
  fps,
  currentFrame,
}) => {
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const activeBone = selectedBoneId ? bones[selectedBoneId] : null;

  return (
    <div className="relative w-full h-full flex flex-col bg-[#070a10] border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Viewport Top Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Stage Viewport
            </span>
          </div>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-mono text-cyan-400">
            F:{currentFrame.toString().padStart(3, '0')} @ {fps}fps
          </span>
          {activeBone && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-amber-300 font-mono">
                Joint: {activeBone.name} ({Math.round(activeBone.currentAngle)}°)
              </span>
            </>
          )}
        </div>

        {/* Viewport Quick Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleBones}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              showBonesOverlay
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
            }`}
            title="Toggle skeletal bone lines and pivot overlay"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Bones</span>
          </button>

          <button
            onClick={onToggleOnionSkin}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              showOnionSkin
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
            }`}
            title="Toggle previous frame ghost silhouette"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ghost</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-1" />

          <button
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoom(1.0);
              setPan({ x: 0, y: 0 });
            }}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Reset viewport camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Viewport Staging Canvas */}
      <div className="relative flex-1 w-full h-full min-h-[380px] overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-[#060913] via-[#091122] to-[#04060b]">
        {/* MULTIPLANE SCENE LAYERS */}

        {/* 1. Deep Space Nebula & Distant Stars */}
        {sceneLayers[0]?.visible && (
          <div
            className="absolute inset-0 pointer-events-none transition-transform"
            style={{
              transform: `translate(${pan.x * 0.1}px, ${pan.y * 0.1}px) scale(${zoom})`,
              opacity: sceneLayers[0].opacity,
            }}
          >
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-900/20 blur-3xl" />
            <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-indigo-900/25 blur-3xl" />
            {/* Ambient Starfield dots */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
          </div>
        )}

        {/* 2. Midground Moon Horizon */}
        {sceneLayers[1]?.visible && (
          <div
            className="absolute inset-x-0 bottom-16 h-48 pointer-events-none transition-transform"
            style={{
              transform: `translate(${pan.x * 0.3}px, ${pan.y * 0.3}px) scale(${zoom})`,
              opacity: sceneLayers[1].opacity,
            }}
          >
            {/* Curved Planetary Rim */}
            <div className="absolute -bottom-12 -left-20 -right-20 h-44 rounded-[50%] bg-gradient-to-t from-slate-900 via-slate-800/80 to-transparent border-t border-cyan-500/20 shadow-[0_-10px_30px_rgba(6,182,212,0.1)]" />
          </div>
        )}

        {/* 3. Station Docking Floor Grid (Character Plane) */}
        {sceneLayers[2]?.visible && (
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{
              transform: `scale(${zoom})`,
              opacity: sceneLayers[2].opacity,
            }}
          >
            {/* Perspective Hexagonal Stage Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:48px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_70%,#000_70%,transparent_100%)] opacity-35" />
            {/* Staging Center Crosshair */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-cyan-500/30" />
          </div>
        )}

        {/* ONION SKIN GHOST (if enabled) */}
        {showOnionSkin && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 filter blur-[0.5px]"
            style={{
              transform: `scale(${zoom}) translate(${pan.x - 12}px, ${pan.y + 4}px)`,
            }}
          >
            <CharacterSvgRig
              bones={bones}
              rootOffset={{ x: rootOffset.x - 8, y: rootOffset.y + 4 }}
              palette={{
                ...palette,
                primary: '#a855f7',
                secondary: '#c084fc',
              }}
              viseme={viseme}
              eyeExpression={eyeExpression}
              showBonesOverlay={false}
              scale={1}
            />
          </div>
        )}

        {/* PRIMARY CHARACTER RIG VIEW */}
        <div
          className="relative w-full max-w-[520px] h-[520px] flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          {runtime === 'canvas' ? (
            <CharacterCanvasRig
              bones={bones}
              rootOffset={rootOffset}
              palette={palette}
              viseme={viseme}
              eyeExpression={eyeExpression}
              showBonesOverlay={showBonesOverlay}
              selectedBoneId={selectedBoneId}
            />
          ) : (
            <CharacterSvgRig
              bones={bones}
              rootOffset={rootOffset}
              palette={palette}
              viseme={viseme}
              eyeExpression={eyeExpression}
              showBonesOverlay={showBonesOverlay}
              selectedBoneId={selectedBoneId}
              onSelectBone={onSelectBone}
              scale={1}
            />
          )}
        </div>

        {/* 4. Foreground HUD Viewfinder Reticle */}
        {sceneLayers[3]?.visible && (
          <div
            className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between"
            style={{ opacity: sceneLayers[3].opacity }}
          >
            <div className="flex justify-between items-start">
              <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-500/40" />
              <div className="text-[10px] font-mono text-cyan-500/60 tracking-wider">
                [CAM-01 DETERMINISTIC ORBIT]
              </div>
              <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-500/40" />
            </div>
            <div className="flex justify-between items-end">
              <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-500/40" />
              <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-500/40" />
            </div>
          </div>
        )}
      </div>

      {/* Viewport Bottom Quick Status */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/90 border-t border-slate-900 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span>Engine: <strong className="text-slate-200">{runtime.toUpperCase()}</strong></span>
          <span className="text-slate-700">|</span>
          <span>Zoom: <strong className="text-slate-200">{Math.round(zoom * 100)}%</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span>Mouth: <strong className="text-pink-400">{viseme}</strong></span>
          <span className="text-slate-700">|</span>
          <span>Eyes: <strong className="text-cyan-400">{eyeExpression}</strong></span>
        </div>
      </div>
    </div>
  );
};
