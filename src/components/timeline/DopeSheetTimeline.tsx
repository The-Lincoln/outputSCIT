import React, { useEffect, useRef } from 'react';
import { Keyframe, TimelineTrack, PhonemeViseme } from '../../types/pipeline';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Repeat,
  Plus,
  Trash2,
  Clock,
} from 'lucide-react';

interface DopeSheetTimelineProps {
  currentFrame: number;
  totalFrames: number;
  fps: number;
  isPlaying: boolean;
  isLooping: boolean;
  onSetFrame: (frame: number) => void;
  onTogglePlay: () => void;
  onToggleLoop: () => void;
  onSetFps: (fps: number) => void;
  tracks: TimelineTrack[];
  keyframes: Keyframe[];
  onAddKeyframe: (trackId: string, value: number | string) => void;
  onDeleteKeyframe: (keyframeId: string) => void;
  onCaptureAllCurrentPose: () => void;
}

export const DopeSheetTimeline: React.FC<DopeSheetTimelineProps> = ({
  currentFrame,
  totalFrames,
  fps,
  isPlaying,
  isLooping,
  onSetFrame,
  onTogglePlay,
  onToggleLoop,
  onSetFps,
  tracks,
  keyframes,
  onAddKeyframe,
  onDeleteKeyframe,
  onCaptureAllCurrentPose,
}) => {
  const rulerRef = useRef<HTMLDivElement | null>(null);
  const currentFrameRef = useRef(currentFrame);
  currentFrameRef.current = currentFrame;

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = 1000 / fps;
    const timer = setInterval(() => {
      const cur = currentFrameRef.current;
      if (cur >= totalFrames) {
        onSetFrame(isLooping ? 0 : totalFrames);
      } else {
        onSetFrame(cur + 1);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, fps, isLooping, totalFrames, onSetFrame]);

  // Click on ruler or track area to scrub frame
  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetFrame = Math.round(ratio * totalFrames);
    onSetFrame(targetFrame);
  };

  const timeSeconds = (currentFrame / fps).toFixed(2);

  return (
    <div className="w-full flex flex-col bg-[#0b0f17] border border-slate-800/90 rounded-xl overflow-hidden shadow-xl">
      {/* 1. Playback Header & Transport Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-slate-800/80 gap-2">
        {/* Playback Transport Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSetFrame(0)}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            title="Jump to Start (Frame 0)"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSetFrame(Math.max(0, currentFrame - 1))}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded text-xs font-mono"
            title="Step back 1 frame"
          >
            -1F
          </button>

          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium text-xs transition-colors ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400'
                : 'bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            onClick={() => onSetFrame(Math.min(totalFrames, currentFrame + 1))}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded text-xs font-mono"
            title="Step forward 1 frame"
          >
            +1F
          </button>

          <button
            onClick={() => onSetFrame(totalFrames)}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            title="Jump to End"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleLoop}
            className={`p-1.5 rounded transition-colors ${
              isLooping ? 'text-cyan-400 bg-cyan-500/20' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle playback loop"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timecode & Frame Telemetry */}
        <div className="flex items-center gap-3 px-2 py-1 bg-slate-950/70 border border-slate-800/80 rounded font-mono text-xs">
          <div className="flex items-center gap-1 text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="tabular-nums font-bold">FRAME: {currentFrame.toString().padStart(3, '0')}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 tabular-nums">{totalFrames}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="text-slate-300 tabular-nums">
            {timeSeconds}s
          </div>
        </div>

        {/* FPS Selector & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* FPS Segmented Control */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded p-0.5 text-xs">
            {[12, 24, 30, 60].map((rate) => (
              <button
                key={`fps-${rate}`}
                onClick={() => onSetFps(rate)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  fps === rate
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rate}fps
              </button>
            ))}
          </div>

          <button
            onClick={onCaptureAllCurrentPose}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded transition-colors"
            title="Save current joints as keyframes across all tracks at playhead"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Keyframe Pose</span>
          </button>
        </div>
      </div>

      {/* 2. Dope Sheet Ruler & Tracks Area */}
      <div className="flex flex-col select-none overflow-x-auto max-h-56">
        {/* Time Ruler */}
        <div className="flex items-center border-b border-slate-800/90 bg-slate-950 sticky top-0 z-10 text-[11px] font-mono text-slate-400">
          <div className="w-48 shrink-0 px-3 py-1.5 border-r border-slate-800 text-slate-400 font-medium">
            TRACK NAME
          </div>
          <div
            ref={rulerRef}
            onClick={handleRulerClick}
            className="relative flex-1 h-7 cursor-pointer bg-slate-950 flex items-center"
          >
            {/* Playhead Marker */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 z-20 pointer-events-none"
              style={{ left: `${(currentFrame / totalFrames) * 100}%` }}
            >
              <div className="w-2.5 h-2.5 -ml-1 bg-cyan-400 rounded-b shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            </div>

            {/* Frame ticks */}
            {Array.from({ length: Math.floor(totalFrames / 6) + 1 }).map((_, i) => {
              const frameNum = i * 6;
              const percent = (frameNum / totalFrames) * 100;
              return (
                <div
                  key={`tick-${frameNum}`}
                  className="absolute top-0 h-full flex flex-col justify-end pb-0.5 border-l border-slate-800/70 pointer-events-none"
                  style={{ left: `${percent}%` }}
                >
                  <span className="text-[9px] text-slate-400 pl-1">{frameNum}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tracks List */}
        <div className="flex flex-col divide-y divide-slate-800/50">
          {tracks.map((track) => {
            const trackKeyframes = keyframes.filter((k) => k.trackId === track.id);
            return (
              <div key={track.id} className="flex items-center hover:bg-slate-900/40 text-xs">
                {/* Track Header */}
                <div className="w-48 shrink-0 px-3 py-2 border-r border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: track.color }}
                    />
                    <span className="text-slate-300 font-medium truncate">{track.name}</span>
                  </div>
                  <button
                    onClick={() => onAddKeyframe(track.id, track.type === 'viseme' ? 'smile' : 0)}
                    className="p-1 text-slate-500 hover:text-cyan-400 rounded transition-colors"
                    title={`Add keyframe at frame ${currentFrame}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Track Keyframes Bar */}
                <div
                  onClick={handleRulerClick}
                  className="relative flex-1 h-8 cursor-pointer bg-slate-900/20"
                >
                  {/* Playhead vertical line */}
                  <div
                    className="absolute top-0 bottom-0 w-[1px] bg-cyan-400/40 pointer-events-none z-10"
                    style={{ left: `${(currentFrame / totalFrames) * 100}%` }}
                  />

                  {/* Render Keyframe Diamonds */}
                  {trackKeyframes.map((kf) => {
                    const isCurrent = kf.frame === currentFrame;
                    const percent = (kf.frame / totalFrames) * 100;
                    return (
                      <div
                        key={kf.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetFrame(kf.frame);
                        }}
                        className="group absolute top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 flex items-center justify-center cursor-pointer z-20"
                        style={{ left: `${percent}%` }}
                        title={`Frame ${kf.frame}: ${kf.value} (${kf.easing})`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rotate-45 border transition-all ${
                            isCurrent
                              ? 'bg-amber-400 border-amber-200 scale-125 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                              : 'bg-cyan-500 border-cyan-300 hover:scale-125'
                          }`}
                        />
                        {/* Quick Delete popup on hover */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteKeyframe(kf.id);
                          }}
                          className="hidden group-hover:flex absolute -top-5 p-0.5 bg-red-950 border border-red-700 text-red-300 rounded shadow text-[9px]"
                          title="Delete keyframe"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
