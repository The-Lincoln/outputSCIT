import React from 'react';
import { CharacterSpec, CharacterPalette, StageStatus, PhonemeViseme } from '../../types/pipeline';
import { Palette, Eye, Smile, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface CharacterDesignStageProps {
  characterSpec: CharacterSpec;
  onUpdatePalette: (palette: Partial<CharacterPalette>) => void;
  stageStatus: StageStatus;
  onOpenGateModal: () => void;
  currentViseme: PhonemeViseme;
  onSelectViseme: (v: PhonemeViseme) => void;
  currentEyeState: string;
  onSelectEyeState: (e: any) => void;
}

export const CharacterDesignStage: React.FC<CharacterDesignStageProps> = ({
  characterSpec,
  onUpdatePalette,
  stageStatus,
  onOpenGateModal,
  currentViseme,
  onSelectViseme,
  currentEyeState,
  onSelectEyeState,
}) => {
  const paletteEntries: Array<{ key: keyof CharacterPalette; label: string }> = [
    { key: 'primary', label: 'Primary Suit' },
    { key: 'secondary', label: 'Limb Accent' },
    { key: 'accent', label: 'Solar Gold / Visor' },
    { key: 'skin', label: 'Helmet Pearlescent' },
    { key: 'outline', label: 'Vector Line Art' },
    { key: 'eyePupil', label: 'Digital Visor Glow' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Director: pipelines/character-animation/character-design-director · APPROVAL GATE
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Character Turnarounds, Color Swatches & Phonemes
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Decomposes character anatomy into vector turnaround proportions, a 60-30-10 palette system, and digital speech visemes.
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
              <span>Design Approved</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 fill-current" />
              <span>Review Design</span>
            </>
          )}
        </button>
      </div>

      {/* Palette Editor & Viseme Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color Palette Swatches */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              60-30-10 Color System Swatches
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {paletteEntries.map(({ key, label }) => (
              <div key={key} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-200">{label}</div>
                  <div className="text-[10px] font-mono text-slate-500">{characterSpec.palette[key]}</div>
                </div>
                <input
                  type="color"
                  value={characterSpec.palette[key]}
                  onChange={(e) => onUpdatePalette({ [key]: e.target.value })}
                  className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Eye State & Expressions */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Digital Visor Eye Expressions
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'open', label: 'Default Confident', desc: 'Alert circular pupils with white iris' },
              { id: 'wide', label: 'Wide / Excited', desc: 'Dilated eyes with double glint reflections' },
              { id: 'squint', label: 'Playful Squint', desc: 'Triangular cartoon smirk angles' },
              { id: 'blink', label: 'Closed Blink', desc: 'Curved eyelid blink frame' },
            ].map((eye) => (
              <button
                key={eye.id}
                onClick={() => onSelectEyeState(eye.id)}
                className={`p-2.5 rounded-lg text-left border transition-all ${
                  currentEyeState === eye.id
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">{eye.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{eye.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
