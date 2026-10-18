import React, { useState, useMemo } from 'react';
import {
  StageId,
  AnimationRuntime,
  ProjectState,
  Pose,
  PhonemeViseme,
  ScriptBeat,
  CharacterPalette,
} from './types/pipeline';
import {
  INITIAL_PROJECT_STATE,
  STAGE_DEFINITIONS,
} from './data/initialProject';
import { evaluateTrackValue } from './utils/kinematics';
import { ExecutiveProducerBar } from './components/ExecutiveProducerBar';
import { StageNavigator } from './components/StageNavigator';
import { CharacterViewport } from './components/viewport/CharacterViewport';
import { DopeSheetTimeline } from './components/timeline/DopeSheetTimeline';
import { PoseLibraryPanel } from './components/inspectors/PoseLibraryPanel';
import { CheckpointGateModal } from './components/CheckpointGateModal';

// Stages
import { ResearchStage } from './components/stages/ResearchStage';
import { ProposalStage } from './components/stages/ProposalStage';
import { SampleStage } from './components/stages/SampleStage';
import { ScriptStage } from './components/stages/ScriptStage';
import { CharacterDesignStage } from './components/stages/CharacterDesignStage';
import { RigPlanStage } from './components/stages/RigPlanStage';
import { ScenePlanStage } from './components/stages/ScenePlanStage';
import { AssetsStage } from './components/stages/AssetsStage';
import { EditStage } from './components/stages/EditStage';
import { ComposeStage } from './components/stages/ComposeStage';
import { PublishStage } from './components/stages/PublishStage';

export default function App() {
  const [project, setProject] = useState<ProjectState>(INITIAL_PROJECT_STATE);
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);

  // Active Stage Definition
  const currentStageDef = useMemo(() => {
    return (
      STAGE_DEFINITIONS.find((s) => s.id === project.currentStageId) ||
      STAGE_DEFINITIONS[0]
    );
  }, [project.currentStageId]);

  const currentStageState = project.stages[project.currentStageId];

  // Dynamic bone angles and values interpolated from keyframes at currentFrame
  const animatedBones = useMemo(() => {
    const updated = { ...project.bones };

    // Evaluated from tracks
    const torsoAngle = evaluateTrackValue(
      project.keyframes,
      'tr_torso',
      project.currentFrame,
      updated.torso.currentAngle
    );
    if (typeof torsoAngle === 'number') {
      updated.torso = { ...updated.torso, currentAngle: torsoAngle };
    }

    const headAngle = evaluateTrackValue(
      project.keyframes,
      'tr_head',
      project.currentFrame,
      updated.head.currentAngle
    );
    if (typeof headAngle === 'number') {
      updated.head = { ...updated.head, currentAngle: headAngle };
    }

    const armLAngle = evaluateTrackValue(
      project.keyframes,
      'tr_arm_l',
      project.currentFrame,
      updated.left_upper_arm.currentAngle
    );
    if (typeof armLAngle === 'number') {
      updated.left_upper_arm = { ...updated.left_upper_arm, currentAngle: armLAngle };
    }

    const forearmLAngle = evaluateTrackValue(
      project.keyframes,
      'tr_forearm_l',
      project.currentFrame,
      updated.left_forearm.currentAngle
    );
    if (typeof forearmLAngle === 'number') {
      updated.left_forearm = { ...updated.left_forearm, currentAngle: forearmLAngle };
    }

    const armRAngle = evaluateTrackValue(
      project.keyframes,
      'tr_arm_r',
      project.currentFrame,
      updated.right_upper_arm.currentAngle
    );
    if (typeof armRAngle === 'number') {
      updated.right_upper_arm = { ...updated.right_upper_arm, currentAngle: armRAngle };
    }

    const forearmRAngle = evaluateTrackValue(
      project.keyframes,
      'tr_forearm_r',
      project.currentFrame,
      updated.right_forearm.currentAngle
    );
    if (typeof forearmRAngle === 'number') {
      updated.right_forearm = { ...updated.right_forearm, currentAngle: forearmRAngle };
    }

    const legLAngle = evaluateTrackValue(
      project.keyframes,
      'tr_leg_l',
      project.currentFrame,
      updated.left_thigh.currentAngle
    );
    if (typeof legLAngle === 'number') {
      updated.left_thigh = { ...updated.left_thigh, currentAngle: legLAngle };
    }

    const legRAngle = evaluateTrackValue(
      project.keyframes,
      'tr_leg_r',
      project.currentFrame,
      updated.right_thigh.currentAngle
    );
    if (typeof legRAngle === 'number') {
      updated.right_thigh = { ...updated.right_thigh, currentAngle: legRAngle };
    }

    return updated;
  }, [project.bones, project.keyframes, project.currentFrame]);

  // Evaluated Root Y Offset
  const animatedRootOffset = useMemo(() => {
    const rootY = evaluateTrackValue(
      project.keyframes,
      'tr_root_y',
      project.currentFrame,
      0
    );
    return {
      x: 0,
      y: typeof rootY === 'number' ? rootY : 0,
    };
  }, [project.keyframes, project.currentFrame]);

  // Evaluated Viseme
  const animatedViseme = useMemo(() => {
    const v = evaluateTrackValue(
      project.keyframes,
      'tr_viseme',
      project.currentFrame,
      project.currentPose.viseme
    );
    return (v as PhonemeViseme) || 'rest';
  }, [project.keyframes, project.currentFrame, project.currentPose.viseme]);

  // Evaluated Eye State
  const animatedEyeState = useMemo(() => {
    const e = evaluateTrackValue(
      project.keyframes,
      'tr_eyes',
      project.currentFrame,
      project.currentPose.eyeExpression
    );
    return (e as any) || 'open';
  }, [project.keyframes, project.currentFrame, project.currentPose.eyeExpression]);

  // Stage Switching
  const handleSelectStage = (stageId: StageId) => {
    setProject((prev) => ({ ...prev, currentStageId: stageId }));
  };

  // Runtime Switching
  const handleSelectRuntime = (runtime: AnimationRuntime) => {
    setProject((prev) => ({ ...prev, runtime }));
  };

  // Apply Pose from Library
  const handleApplyPose = (pose: Pose) => {
    setProject((prev) => {
      const newBones = { ...prev.bones };
      Object.entries(pose.jointAngles).forEach(([boneId, angle]) => {
        if (newBones[boneId]) {
          newBones[boneId] = { ...newBones[boneId], currentAngle: angle };
        }
      });
      return {
        ...prev,
        currentPose: pose,
        bones: newBones,
      };
    });
  };

  // Save current joint angles as new pose
  const handleSaveCurrentAsPose = (
    name: string,
    category: 'idle' | 'locomotion' | 'action' | 'expression'
  ) => {
    const angles: Record<string, number> = {};
    Object.values(project.bones).forEach((b) => {
      angles[b.id] = b.currentAngle;
    });

    const newPose: Pose = {
      id: `pose-${Date.now()}`,
      name,
      category,
      description: `User-defined ${category} pose captured from viewport.`,
      rootOffset: animatedRootOffset,
      jointAngles: angles,
      viseme: animatedViseme,
      eyeExpression: animatedEyeState,
      timestamp: new Date().toLocaleTimeString(),
    };

    setProject((prev) => ({
      ...prev,
      poses: [...prev.poses, newPose],
      currentPose: newPose,
    }));
  };

  // Capture all current angles as keyframes on the timeline
  const handleCapturePoseToKeyframes = () => {
    const f = project.currentFrame;
    const newKeys = [...project.keyframes.filter((k) => k.frame !== f)];

    newKeys.push(
      { id: `kf-${f}-root`, frame: f, trackId: 'tr_root_y', value: animatedRootOffset.y, easing: 'ease-in-out' },
      { id: `kf-${f}-torso`, frame: f, trackId: 'tr_torso', value: project.bones.torso.currentAngle, easing: 'ease-in-out' },
      { id: `kf-${f}-head`, frame: f, trackId: 'tr_head', value: project.bones.head.currentAngle, easing: 'ease-in-out' },
      { id: `kf-${f}-arml`, frame: f, trackId: 'tr_arm_l', value: project.bones.left_upper_arm.currentAngle, easing: 'ease-in-out' },
      { id: `kf-${f}-farml`, frame: f, trackId: 'tr_forearm_l', value: project.bones.left_forearm.currentAngle, easing: 'ease-in-out' },
      { id: `kf-${f}-armr`, frame: f, trackId: 'tr_arm_r', value: project.bones.right_upper_arm.currentAngle, easing: 'ease-in-out' },
      { id: `kf-${f}-farmr`, frame: f, trackId: 'tr_forearm_r', value: project.bones.right_forearm.currentAngle, easing: 'ease-in-out' },
      { id: `kf-${f}-legl`, frame: f, trackId: 'tr_leg_l', value: project.bones.left_thigh.currentAngle, easing: 'ease-in-out' },
      { id: `kf-${f}-legr`, frame: f, trackId: 'tr_leg_r', value: project.bones.right_thigh.currentAngle, easing: 'ease-in-out' },
      { id: `kf-${f}-vis`, frame: f, trackId: 'tr_viseme', value: animatedViseme, easing: 'step' },
      { id: `kf-${f}-eye`, frame: f, trackId: 'tr_eyes', value: animatedEyeState, easing: 'step' }
    );

    setProject((prev) => ({
      ...prev,
      keyframes: newKeys,
    }));
  };

  // Bone Angle Update
  const handleUpdateBoneAngle = (boneId: string, angle: number) => {
    setProject((prev) => ({
      ...prev,
      bones: {
        ...prev.bones,
        [boneId]: {
          ...prev.bones[boneId],
          currentAngle: angle,
        },
      },
    }));
  };

  // Reset joints to default angles
  const handleResetJoints = () => {
    setProject((prev) => {
      const reset = { ...prev.bones };
      Object.keys(reset).forEach((k) => {
        reset[k] = { ...reset[k], currentAngle: reset[k].defaultAngle };
      });
      return { ...prev, bones: reset };
    });
  };

  // Checkpoint Criteria Toggle
  const handleToggleCriteria = (criteriaId: string) => {
    setProject((prev) => {
      const stage = prev.stages[prev.currentStageId];
      const updatedCriteria = stage.criteria.map((c) =>
        c.id === criteriaId ? { ...c, passed: !c.passed } : c
      );
      return {
        ...prev,
        stages: {
          ...prev.stages,
          [prev.currentStageId]: {
            ...stage,
            criteria: updatedCriteria,
          },
        },
      };
    });
  };

  // Stage Approval
  const handleApproveStage = (comment: string) => {
    setProject((prev) => ({
      ...prev,
      stages: {
        ...prev.stages,
        [prev.currentStageId]: {
          ...prev.stages[prev.currentStageId],
          status: 'approved',
          reviewNotes: comment,
          approvedAt: new Date().toISOString(),
        },
      },
      reviewHistory: [
        {
          id: `rev-${Date.now()}`,
          stageId: prev.currentStageId,
          reviewer: 'Executive Producer',
          action: 'approve',
          timestamp: new Date().toLocaleTimeString(),
          comment,
        },
        ...prev.reviewHistory,
      ],
    }));
  };

  // Request Revisions
  const handleRequestRevisions = (comment: string) => {
    setProject((prev) => ({
      ...prev,
      stages: {
        ...prev.stages,
        [prev.currentStageId]: {
          ...prev.stages[prev.currentStageId],
          status: 'changes_requested',
          reviewNotes: comment,
        },
      },
      reviewHistory: [
        {
          id: `rev-${Date.now()}`,
          stageId: prev.currentStageId,
          reviewer: 'Executive Producer',
          action: 'revise',
          timestamp: new Date().toLocaleTimeString(),
          comment,
        },
        ...prev.reviewHistory,
      ],
    }));
  };

  // Submit for Review
  const handleSubmitForReview = (comment: string) => {
    setProject((prev) => ({
      ...prev,
      stages: {
        ...prev.stages,
        [prev.currentStageId]: {
          ...prev.stages[prev.currentStageId],
          status: 'under_review',
          reviewNotes: comment,
        },
      },
      reviewHistory: [
        {
          id: `rev-${Date.now()}`,
          stageId: prev.currentStageId,
          reviewer: 'Executive Producer',
          action: 'submit',
          timestamp: new Date().toLocaleTimeString(),
          comment,
        },
        ...prev.reviewHistory,
      ],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a10] text-slate-100 font-sans">
      {/* 1. Executive Producer Top Bar */}
      <ExecutiveProducerBar
        projectTitle={project.title}
        currentStageId={project.currentStageId}
        stageName={currentStageDef.name}
        stageNumber={currentStageDef.order}
        stageStatus={currentStageState.status}
        runtime={project.runtime}
        onSelectRuntime={handleSelectRuntime}
        onOpenCheckpointModal={() => setIsCheckpointModalOpen(true)}
        requiresApproval={currentStageDef.requiresApproval}
      />

      {/* 2. Main Studio Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: 11-Stage Pipeline Rail */}
        <StageNavigator
          currentStageId={project.currentStageId}
          onSelectStage={handleSelectStage}
          stagesState={project.stages}
        />

        {/* Center & Right Work Area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
          {/* Active Stage Director Workspace (Left Column) */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-slate-800/80 max-w-4xl">
            {project.currentStageId === 'research' && (
              <ResearchStage
                characterSpec={project.characterSpec}
                onUpdateSpec={(spec) =>
                  setProject((p) => ({ ...p, characterSpec: { ...p.characterSpec, ...spec } }))
                }
                fps={project.fps}
                onSetFps={(fps) => setProject((p) => ({ ...p, fps }))}
              />
            )}

            {project.currentStageId === 'proposal' && (
              <ProposalStage
                stageStatus={currentStageState.status}
                onOpenGateModal={() => setIsCheckpointModalOpen(true)}
              />
            )}

            {project.currentStageId === 'sample' && (
              <SampleStage
                stageStatus={currentStageState.status}
                onOpenGateModal={() => setIsCheckpointModalOpen(true)}
                poses={project.poses}
                onApplyPose={handleApplyPose}
                currentFrame={project.currentFrame}
                totalFrames={project.totalFrames}
                isPlaying={project.isPlaying}
                onTogglePlay={() => setProject((p) => ({ ...p, isPlaying: !p.isPlaying }))}
              />
            )}

            {project.currentStageId === 'script' && (
              <ScriptStage
                stageStatus={currentStageState.status}
                onOpenGateModal={() => setIsCheckpointModalOpen(true)}
                scriptBeats={project.scriptBeats}
                onUpdateBeats={(beats) => setProject((p) => ({ ...p, scriptBeats: beats }))}
                onJumpToFrame={(f) => setProject((p) => ({ ...p, currentFrame: f }))}
                currentFrame={project.currentFrame}
              />
            )}

            {project.currentStageId === 'character_design' && (
              <CharacterDesignStage
                characterSpec={project.characterSpec}
                onUpdatePalette={(pal) =>
                  setProject((p) => ({
                    ...p,
                    characterSpec: {
                      ...p.characterSpec,
                      palette: { ...p.characterSpec.palette, ...pal },
                    },
                  }))
                }
                stageStatus={currentStageState.status}
                onOpenGateModal={() => setIsCheckpointModalOpen(true)}
                currentViseme={animatedViseme}
                onSelectViseme={(v) =>
                  setProject((p) => ({
                    ...p,
                    currentPose: { ...p.currentPose, viseme: v },
                  }))
                }
                currentEyeState={animatedEyeState}
                onSelectEyeState={(e) =>
                  setProject((p) => ({
                    ...p,
                    currentPose: { ...p.currentPose, eyeExpression: e },
                  }))
                }
              />
            )}

            {project.currentStageId === 'rig_plan' && (
              <RigPlanStage
                bones={project.bones}
                selectedBoneId={project.selectedBoneId}
                onSelectBone={(id) => setProject((p) => ({ ...p, selectedBoneId: id }))}
                onUpdateBoneAngle={handleUpdateBoneAngle}
                onResetJoints={handleResetJoints}
              />
            )}

            {project.currentStageId === 'scene_plan' && (
              <ScenePlanStage
                sceneLayers={project.sceneLayers}
                onToggleLayerVisibility={(layerId) =>
                  setProject((p) => ({
                    ...p,
                    sceneLayers: p.sceneLayers.map((l) =>
                      l.id === layerId ? { ...l, visible: !l.visible } : l
                    ),
                  }))
                }
                onUpdateLayerOpacity={(layerId, opacity) =>
                  setProject((p) => ({
                    ...p,
                    sceneLayers: p.sceneLayers.map((l) =>
                      l.id === layerId ? { ...l, opacity } : l
                    ),
                  }))
                }
                stageStatus={currentStageState.status}
                onOpenGateModal={() => setIsCheckpointModalOpen(true)}
              />
            )}

            {project.currentStageId === 'assets' && (
              <AssetsStage
                palette={project.characterSpec.palette}
                stageStatus={currentStageState.status}
                onOpenGateModal={() => setIsCheckpointModalOpen(true)}
              />
            )}

            {project.currentStageId === 'edit' && (
              <EditStage
                tracks={project.tracks}
                keyframes={project.keyframes}
                currentFrame={project.currentFrame}
                totalFrames={project.totalFrames}
                fps={project.fps}
                onJumpToFrame={(f) => setProject((p) => ({ ...p, currentFrame: f }))}
              />
            )}

            {project.currentStageId === 'compose' && (
              <ComposeStage sceneLayers={project.sceneLayers} fps={project.fps} />
            )}

            {project.currentStageId === 'publish' && (
              <PublishStage
                characterSpec={project.characterSpec}
                bones={project.bones}
                keyframes={project.keyframes}
                tracks={project.tracks}
                fps={project.fps}
                totalFrames={project.totalFrames}
                stageStatus={currentStageState.status}
                onOpenGateModal={() => setIsCheckpointModalOpen(true)}
              />
            )}
          </div>

          {/* Right Column: Viewport & Pose Inspector */}
          <div className="w-full lg:w-[480px] p-6 flex flex-col space-y-4 shrink-0 bg-[#090d15]/50">
            {/* Viewport Box */}
            <div className="h-[440px]">
              <CharacterViewport
                runtime={project.runtime}
                bones={animatedBones}
                rootOffset={animatedRootOffset}
                palette={project.characterSpec.palette}
                viseme={animatedViseme}
                eyeExpression={animatedEyeState}
                showBonesOverlay={project.showBonesOverlay}
                onToggleBones={() =>
                  setProject((p) => ({ ...p, showBonesOverlay: !p.showBonesOverlay }))
                }
                showOnionSkin={project.showOnionSkin}
                onToggleOnionSkin={() =>
                  setProject((p) => ({ ...p, showOnionSkin: !p.showOnionSkin }))
                }
                selectedBoneId={project.selectedBoneId}
                onSelectBone={(id) => setProject((p) => ({ ...p, selectedBoneId: id }))}
                sceneLayers={project.sceneLayers}
                fps={project.fps}
                currentFrame={project.currentFrame}
              />
            </div>

            {/* Pose & Viseme Library */}
            <PoseLibraryPanel
              poses={project.poses}
              currentPose={project.currentPose}
              onApplyPose={handleApplyPose}
              onSaveCurrentAsPose={handleSaveCurrentAsPose}
              onApplyViseme={(v) =>
                setProject((p) => ({
                  ...p,
                  currentPose: { ...p.currentPose, viseme: v },
                }))
              }
              currentViseme={animatedViseme}
            />
          </div>
        </main>
      </div>

      {/* 3. Bottom Interactive Dope Sheet Timeline */}
      <div className="p-3 bg-[#080c14] border-t border-slate-800/90">
        <DopeSheetTimeline
          currentFrame={project.currentFrame}
          totalFrames={project.totalFrames}
          fps={project.fps}
          isPlaying={project.isPlaying}
          isLooping={project.isLooping}
          onSetFrame={(frame) => setProject((p) => ({ ...p, currentFrame: frame }))}
          onTogglePlay={() => setProject((p) => ({ ...p, isPlaying: !p.isPlaying }))}
          onToggleLoop={() => setProject((p) => ({ ...p, isLooping: !p.isLooping }))}
          onSetFps={(fps) => setProject((p) => ({ ...p, fps }))}
          tracks={project.tracks}
          keyframes={project.keyframes}
          onAddKeyframe={(trackId, value) => {
            const newKey = {
              id: `kf-${Date.now()}`,
              frame: project.currentFrame,
              trackId,
              value,
              easing: 'ease-in-out' as const,
            };
            setProject((p) => ({
              ...p,
              keyframes: [...p.keyframes.filter((k) => !(k.frame === project.currentFrame && k.trackId === trackId)), newKey],
            }));
          }}
          onDeleteKeyframe={(id) => {
            setProject((p) => ({
              ...p,
              keyframes: p.keyframes.filter((k) => k.id !== id),
            }));
          }}
          onCaptureAllCurrentPose={handleCapturePoseToKeyframes}
        />
      </div>

      {/* 4. Checkpoint Protocol Modal */}
      <CheckpointGateModal
        isOpen={isCheckpointModalOpen}
        onClose={() => setIsCheckpointModalOpen(false)}
        stageDef={currentStageDef}
        stageStatus={currentStageState.status}
        criteria={currentStageState.criteria}
        onToggleCriteria={handleToggleCriteria}
        onApproveStage={handleApproveStage}
        onRequestRevisions={handleRequestRevisions}
        onSubmitForReview={handleSubmitForReview}
        reviewHistory={project.reviewHistory}
      />
    </div>
  );
}
