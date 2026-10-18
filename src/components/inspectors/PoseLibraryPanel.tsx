import React, { useState } from 'react';
import { Pose, BoneNode, PhonemeViseme } from '../../types/pipeline';
import { Bookmark, Play, Plus, RefreshCw, Check } from 'lucide-react';

interface PoseLibraryPanelProps {
  poses: Pose[];
  currentPose: Pose;
  onApplyPose: (pose: Pose) => void;
  onSaveCurrentAsPose: (name: string, category: 'idle' | 'locomotion' | 'action' | 'expression') => void;
  onApplyViseme: (viseme: PhonemeViseme) => void;
  currentViseme: PhonemeViseme;
}

export const PoseLibraryPanel: React.FC<PoseLibraryPanelProps> = ({
  poses,
  currentPose,
  onApplyPose,
  onSaveCurrentAsPose,
  onApplyViseme,
  currentViseme,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddingPose, setIsAddingPose] = useState(false);
  const [newPoseName, setNewPoseName] = useState('');
  const [newPoseCategory, setNewPoseCategory] = useState<'idle' | 'locomotion' | 'action' | 'expression'>('action');

  const filteredPoses = filterCategory === 'all'
    ? poses
    : poses.filter((p) => p.category === filterCategory);

  const visemeList: Array<{ id: PhonemeViseme; label: string; sound: string }> = [
    { id: 'rest', label: 'Rest', sound: 'Neutral / Closed' },
    { id: 'A_E', label: 'A / E', sound: 'Ah, Eh, Hat' },
    { id: 'O_U', label: 'O / U', sound: 'Oh, Ooh, You' },
    { id: 'M_B_P', label: 'M / B / P', sound: 'Mom, Pop, Bat' },
    { id: 'L_D_T', label: 'L / D / T', sound: 'Light, Day, Top' },
    { id: 'F_V', label: 'F / V', sound: 'Fox, Van' },
    { id: 'smile', label: 'Smile', sound: 'Grin, Cheerful' },
  ];

  const handleSave = () => {
    if (!newPoseName.trim()) return;
    onSaveCurrentAsPose(newPoseName.trim(), newPoseCategory);
    setNewPoseName('');
    setIsAddingPose(false);
  };

  return (
    <div className="flex flex-col bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Pose & Viseme Library
          </h3>
        </div>
        <button
          onClick={() => setIsAddingPose(!isAddingPose)}
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Save Pose</span>
        </button>
      </div>

      {/* Save Pose Sub-Form */}
      {isAddingPose && (
        <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/30 space-y-2">
          <input
            type="text"
            value={newPoseName}
            onChange={(e) => setNewPoseName(e.target.value)}
            placeholder="Pose name (e.g. Hero Landing)"
            className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
          <div className="flex items-center justify-between gap-2">
            <select
              value={newPoseCategory}
              onChange={(e) => setNewPoseCategory(e.target.value as any)}
              className="text-xs bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300"
            >
              <option value="idle">Idle</option>
              <option value="locomotion">Locomotion</option>
              <option value="action">Action</option>
              <option value="expression">Expression</option>
            </select>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold rounded text-xs hover:bg-cyan-400 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg text-xs overflow-x-auto">
        {['all', 'idle', 'locomotion', 'action', 'expression'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-2.5 py-1 rounded text-[11px] capitalize whitespace-nowrap transition-colors ${
              filterCategory === cat
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Poses Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
        {filteredPoses.map((pose) => {
          const isSelected = currentPose.id === pose.id;
          return (
            <button
              key={pose.id}
              onClick={() => onApplyPose(pose)}
              className={`p-2.5 rounded-lg text-left border transition-all ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold truncate">{pose.name}</span>
                {isSelected && <Check className="w-3 h-3 text-cyan-400 shrink-0" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {pose.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Viseme Palette Section */}
      <div className="pt-2 border-t border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">
          Facial Visemes (Phonemes)
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          {visemeList.map((v) => (
            <button
              key={v.id}
              onClick={() => onApplyViseme(v.id)}
              className={`p-1.5 rounded border text-center transition-all ${
                currentViseme === v.id
                  ? 'bg-pink-950/40 border-pink-500 text-pink-300 font-bold'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-xs font-mono">{v.label}</div>
              <div className="text-[9px] text-slate-500 truncate">{v.sound}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
