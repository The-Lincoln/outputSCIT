/**
 * Character Animation Pipeline Types
 * Covering the 11 pipeline stages, modular cartoon rigs, forward kinematics,
 * dope sheet action timelines, multi-runtime playback, and checkpoint protocols.
 */

export type StageId =
  | 'research'
  | 'proposal'
  | 'sample'
  | 'script'
  | 'character_design'
  | 'rig_plan'
  | 'scene_plan'
  | 'assets'
  | 'edit'
  | 'compose'
  | 'publish';

export type StageStatus = 'draft' | 'under_review' | 'approved' | 'changes_requested';

export interface CheckpointCriteria {
  id: string;
  label: string;
  passed: boolean;
  notes?: string;
}

export interface ReviewLogEntry {
  id: string;
  stageId: StageId;
  reviewer: string;
  action: 'submit' | 'approve' | 'reject' | 'revise';
  timestamp: string;
  comment: string;
}

export interface StageDefinition {
  id: StageId;
  order: number;
  name: string;
  shortName: string;
  directorRole: string;
  directorSkill: string;
  requiresApproval: boolean;
  description: string;
  criteria: CheckpointCriteria[];
}

export type AnimationRuntime = 'svg' | 'canvas' | 'remotion' | 'hyperframes';

// Character Bone Definition for 2D Forward Kinematics
export interface BoneNode {
  id: string;
  name: string;
  parentId: string | null;
  length: number;
  defaultAngle: number; // degrees
  currentAngle: number; // degrees
  minAngle: number;
  maxAngle: number;
  pivotOffset: { x: number; y: number }; // Relative to parent tip or root
  color: string;
  part: 'root' | 'torso' | 'head' | 'left_arm' | 'right_arm' | 'left_leg' | 'right_leg' | 'antenna' | 'tail';
}

export interface CalculatedJoint {
  id: string;
  name: string;
  parentId: string | null;
  worldX: number;
  worldY: number;
  worldAngle: number; // Cumulative angle in radians
  tipX: number;
  tipY: number;
  length: number;
  part: string;
}

export type PhonemeViseme = 'rest' | 'A_E' | 'O_U' | 'M_B_P' | 'L_D_T' | 'F_V' | 'smile';

export interface Pose {
  id: string;
  name: string;
  category: 'idle' | 'locomotion' | 'action' | 'expression';
  description: string;
  rootOffset: { x: number; y: number };
  jointAngles: Record<string, number>; // boneId -> angle in degrees
  viseme: PhonemeViseme;
  eyeExpression: 'open' | 'blink' | 'squint' | 'wide' | 'wink';
  timestamp?: string;
}

export interface Keyframe {
  id: string;
  frame: number;
  trackId: string;
  value: number | string; // angle number or viseme string
  easing: 'linear' | 'ease-in-out' | 'ease-in' | 'ease-out' | 'step';
}

export interface TimelineTrack {
  id: string;
  name: string;
  boneId?: string;
  type: 'joint_rotation' | 'root_pos_x' | 'root_pos_y' | 'viseme' | 'eye_state';
  color: string;
}

export interface ScriptBeat {
  id: string;
  timestamp: string; // e.g. "00:01.2"
  frame: number;
  speaker: string;
  line: string;
  actionNote: string;
  emotion: string;
  phonemeMarkers: Array<{ phoneme: PhonemeViseme; offsetFrame: number }>;
}

export interface SceneLayer {
  id: string;
  name: string;
  depthParallax: number; // 0 = static bg, 1 = character plane, >1 = foreground
  visible: boolean;
  opacity: number;
  tintColor: string;
  description: string;
}

export interface CharacterPalette {
  primary: string;
  secondary: string;
  accent: string;
  skin: string;
  outline: string;
  eyeWhite: string;
  eyePupil: string;
  mouthInterior: string;
  tongue: string;
}

export interface CharacterSpec {
  id: string;
  name: string;
  universe: string;
  archetype: string;
  styleBible: string;
  scaleFactor: number;
  lineWeight: number;
  palette: CharacterPalette;
  proportions: {
    headRatio: number;
    torsoRatio: number;
    limbRatio: number;
    squashStretchLimit: number;
  };
}

export interface ProjectState {
  id: string;
  title: string;
  currentStageId: StageId;
  runtime: AnimationRuntime;
  fps: number;
  totalFrames: number;
  currentFrame: number;
  isPlaying: boolean;
  isLooping: boolean;
  showBonesOverlay: boolean;
  showOnionSkin: boolean;
  selectedBoneId: string | null;

  // Pipeline Data
  stages: Record<StageId, {
    status: StageStatus;
    criteria: CheckpointCriteria[];
    reviewNotes: string;
    approvedAt: string | null;
  }>;
  reviewHistory: ReviewLogEntry[];

  // Stage Deliverables
  characterSpec: CharacterSpec;
  bones: Record<string, BoneNode>;
  poses: Pose[];
  currentPose: Pose;
  tracks: TimelineTrack[];
  keyframes: Keyframe[];
  scriptBeats: ScriptBeat[];
  sceneLayers: SceneLayer[];
  cameraFraming: { zoom: number; panX: number; panY: number };
}
