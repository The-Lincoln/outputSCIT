import React from 'react';
import { TimelineTrack, Keyframe } from '../../types/pipeline';
import { Clock, Sliders, Activity, Sparkles } from 'lucide-react';

interface EditStageProps {
  tracks: TimelineTrack[];
  keyframes: Keyframe[];
  currentFrame: number;
  totalFrames: number;
  fps: number;
  onJumpToFrame: (f: number) => void;
}

export const EditStage: React.FC<EditStageProps> = ({
  tracks,
  keyframes,
  currentFrame,
  totalFrames,
  fps,
  onJumpToFrame,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Director: pipelines/character-animation/edit-director
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Action Timeline, Dope Sheet Timing & Easing Curves
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Tunes cartoon anticipation frames, follow-through oscillations, and mathematical cubic bezier acceleration curves across all joint tracks.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-cyan-400">
          <span>{keyframes.length} KEYFRAMES</span>
          <span className="text-slate-700">|</span>
          <span>{tracks.length} TRACKS</span>
        </div>
      </div>

      {/* Timing Chart Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Keyframe Beat Markers */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Action Rhythm Milestones
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { frame: 0, title: 'Idle Ready', note: 'Balanced stance, calm visor look', ease: 'ease-in-out' },
              { frame: 12, title: 'Anticipation Crouch', note: 'Body dips 14px, blink anticipation', ease: 'ease-in-out' },
              { frame: 24, title: 'Wave Peak #1', note: 'Right arm sweeps to -98°, wide eyes', ease: 'snappy cubic' },
              { frame: 32, title: 'Follow-Through Oscillate', note: 'Forearm springback, cheerful smile', ease: 'ease-in-out' },
              { frame: 48, title: 'Loop Settle', note: 'Returns seamlessly to frame 0 values', ease: 'ease-in-out' },
            ].map((beat) => (
              <button
                key={`beat-mile-${beat.frame}`}
                onClick={() => onJumpToFrame(beat.frame)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                  currentFrame === beat.frame
                    ? 'bg-cyan-950/40 border-cyan-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex justify-between font-mono text-[11px]">
                  <strong className="text-cyan-400">FRAME {beat.frame}</strong>
                  <span className="text-slate-500">{beat.ease}</span>
                </div>
                <div className="font-medium text-slate-200 mt-1">{beat.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{beat.note}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Easing Curve Mathematics */}
        <div className="md:col-span-2 p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Deterministic Easing Polynomials
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Rather than linear mechanical motion, cartoon joint angles compute acceleration curves:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-300 font-mono">Cubic Ease-In-Out</span>
              <p className="text-slate-400 text-[11px]">
                Smooth acceleration from rest and soft deceleration at target poses. Prevents robotic snapping.
              </p>
              <div className="text-[10px] font-mono text-slate-500">
                P(t) = t &lt; 0.5 ? 4t³ : 1 - (-2t+2)³/2
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-pink-300 font-mono">Discrete Step Visemes</span>
              <p className="text-slate-400 text-[11px]">
                Immediate frame snap for speech phonemes and eyelid blinks to ensure cartoon punchiness.
              </p>
              <div className="text-[10px] font-mono text-slate-500">
                P(t) = P(0) until target frame
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
