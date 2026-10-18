import React, { useState } from 'react';
import { ScriptBeat, StageStatus, PhonemeViseme } from '../../types/pipeline';
import { MessageSquare, Plus, Trash2, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

interface ScriptStageProps {
  stageStatus: StageStatus;
  onOpenGateModal: () => void;
  scriptBeats: ScriptBeat[];
  onUpdateBeats: (beats: ScriptBeat[]) => void;
  onJumpToFrame: (frame: number) => void;
  currentFrame: number;
}

export const ScriptStage: React.FC<ScriptStageProps> = ({
  stageStatus,
  onOpenGateModal,
  scriptBeats,
  onUpdateBeats,
  onJumpToFrame,
  currentFrame,
}) => {
  const [newSpeaker, setNewSpeaker] = useState('PIP');
  const [newLine, setNewLine] = useState('');
  const [newAction, setNewAction] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddBeat = () => {
    if (!newLine.trim()) return;
    const newBeat: ScriptBeat = {
      id: `beat-${Date.now()}`,
      timestamp: `00:${(currentFrame / 24).toFixed(1)}`,
      frame: currentFrame,
      speaker: newSpeaker,
      line: newLine.trim(),
      actionNote: newAction.trim() || 'Character continues movement choreography.',
      emotion: 'Confident',
      phonemeMarkers: [
        { phoneme: 'rest', offsetFrame: currentFrame },
        { phoneme: 'A_E', offsetFrame: currentFrame + 4 },
        { phoneme: 'smile', offsetFrame: currentFrame + 10 },
      ],
    };
    onUpdateBeats([...scriptBeats, newBeat]);
    setNewLine('');
    setNewAction('');
    setIsAdding(false);
  };

  const handleDeleteBeat = (id: string) => {
    onUpdateBeats(scriptBeats.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Director: pipelines/character-animation/script-director · APPROVAL GATE
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Screenplay Beats & Phoneme Cue Sheet
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Annotates screenplay lines with frame timing, character acting cues, and mouth phoneme key markers.
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
              <span>Script Approved</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 fill-current" />
              <span>Review Script</span>
            </>
          )}
        </button>
      </div>

      {/* Screenplay Beats List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Screenplay Beats ({scriptBeats.length})
          </span>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Beat at Frame {currentFrame}</span>
          </button>
        </div>

        {/* Add Form */}
        {isAdding && (
          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={newSpeaker}
                onChange={(e) => setNewSpeaker(e.target.value)}
                placeholder="Speaker (e.g. PIP)"
                className="w-36 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono"
              />
              <input
                type="text"
                value={newLine}
                onChange={(e) => setNewLine(e.target.value)}
                placeholder="Dialogue line..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100"
              />
            </div>
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              placeholder="Action note (e.g. Waves communicator arm, tilts helmet)..."
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBeat}
                className="px-3 py-1 text-xs font-bold bg-cyan-500 text-slate-950 rounded hover:bg-cyan-400"
              >
                Save Beat
              </button>
            </div>
          </div>
        )}

        {/* Beats Cards */}
        <div className="space-y-2">
          {scriptBeats.map((beat) => (
            <div
              key={beat.id}
              className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 hover:border-slate-700 transition-colors flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400 font-mono">{beat.speaker}</span>
                  <span className="text-slate-600">·</span>
                  <button
                    onClick={() => onJumpToFrame(beat.frame)}
                    className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:underline"
                    title="Jump playhead to this frame"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Frame {beat.frame} ({beat.timestamp})</span>
                  </button>
                  <span className="text-slate-600">·</span>
                  <span className="text-[11px] text-slate-400">{beat.emotion}</span>
                </div>

                <div className="text-sm font-medium text-slate-100 italic">
                  "{beat.line}"
                </div>

                <div className="text-xs text-slate-400">
                  <strong className="text-slate-300">Action:</strong> {beat.actionNote}
                </div>

                {/* Phoneme Viseme Markers */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Phonemes:</span>
                  {beat.phonemeMarkers.map((pm, idx) => (
                    <span
                      key={`pm-${idx}`}
                      className="px-1.5 py-0.5 rounded bg-pink-950/60 border border-pink-800/50 text-[10px] font-mono text-pink-300"
                    >
                      {pm.phoneme} @ F{pm.offsetFrame}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleDeleteBeat(beat.id)}
                className="p-1.5 text-slate-600 hover:text-rose-400 rounded transition-colors"
                title="Delete beat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
