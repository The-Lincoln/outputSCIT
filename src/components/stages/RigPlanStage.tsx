import React from 'react';
import { BoneNode } from '../../types/pipeline';
import { Bone, GitBranch, RotateCcw, Sliders } from 'lucide-react';

interface RigPlanStageProps {
  bones: Record<string, BoneNode>;
  selectedBoneId: string | null;
  onSelectBone: (boneId: string) => void;
  onUpdateBoneAngle: (boneId: string, angle: number) => void;
  onResetJoints: () => void;
}

export const RigPlanStage: React.FC<RigPlanStageProps> = ({
  bones,
  selectedBoneId,
  onSelectBone,
  onUpdateBoneAngle,
  onResetJoints,
}) => {
  const boneList = Object.values(bones);
  const activeBone = selectedBoneId ? bones[selectedBoneId] : boneList[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            Director: pipelines/character-animation/rig-plan-director
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Skeletal Rig Hierarchy & Forward Kinematics (FK)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Configure bone parentage chains, hinge pivot offsets, and min/max angular constraints for deterministic joint calculation.
          </p>
        </div>

        <button
          onClick={onResetJoints}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          title="Reset all joint rotations to resting default angles"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Angles</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bone Hierarchy Tree List */}
        <div className="p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Bones & Joints ({boneList.length})
            </h3>
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {boneList.map((bone) => {
              const isSelected = selectedBoneId === bone.id;
              const indent = bone.parentId ? (bones[bone.parentId]?.parentId ? 'pl-6' : 'pl-3') : 'pl-1';

              return (
                <button
                  key={bone.id}
                  onClick={() => onSelectBone(bone.id)}
                  className={`w-full text-left py-1.5 px-2 rounded text-xs transition-colors flex items-center justify-between ${indent} ${
                    isSelected
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bone.color }} />
                    <span className="truncate">{bone.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {Math.round(bone.currentAngle)}°
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Bone Inspector */}
        {activeBone && (
          <div className="md:col-span-2 p-4 rounded-xl bg-[#0b0f17] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">Selected Joint</span>
                <h3 className="text-sm font-bold text-white font-display">{activeBone.name}</h3>
              </div>
              <div className="text-right text-xs font-mono text-slate-400">
                Parent: <strong className="text-slate-200">{activeBone.parentId || 'None (World Root)'}</strong>
              </div>
            </div>

            {/* FK Angle Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Forward Kinematics (FK) Rotation</span>
                <span className="font-mono text-cyan-400 font-bold">{Math.round(activeBone.currentAngle)}°</span>
              </div>
              <input
                type="range"
                min={activeBone.minAngle}
                max={activeBone.maxAngle}
                step="1"
                value={activeBone.currentAngle}
                onChange={(e) => onUpdateBoneAngle(activeBone.id, parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Min Limit: {activeBone.minAngle}°</span>
                <span>Rest: {activeBone.defaultAngle}°</span>
                <span>Max Limit: {activeBone.maxAngle}°</span>
              </div>
            </div>

            {/* Joint Properties Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-500">BONE LENGTH</div>
                <div className="font-mono text-cyan-300 mt-0.5">{activeBone.length}px</div>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-500">PIVOT OFFSET</div>
                <div className="font-mono text-cyan-300 mt-0.5">({activeBone.pivotOffset.x}, {activeBone.pivotOffset.y})</div>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-500">BODY PART</div>
                <div className="font-mono text-cyan-300 mt-0.5 capitalize">{activeBone.part}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
