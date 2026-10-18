import { BoneNode, CalculatedJoint, Keyframe, PhonemeViseme } from '../types/pipeline';

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Solves hierarchical forward kinematics for a 2D character skeletal rig.
 */
export function solveForwardKinematics(
  bones: Record<string, BoneNode>,
  rootOrigin: { x: number; y: number } = { x: 260, y: 320 }
): Record<string, CalculatedJoint> {
  const result: Record<string, CalculatedJoint> = {};
  const boneList = Object.values(bones);

  // Depth-first or topological traversal to ensure parents are computed before children
  function computeBone(id: string): CalculatedJoint {
    if (result[id]) return result[id];

    const bone = bones[id];
    if (!bone) {
      throw new Error(`Bone not found: ${id}`);
    }

    let worldX = rootOrigin.x;
    let worldY = rootOrigin.y;
    let parentWorldAngle = 0;

    if (bone.parentId && bones[bone.parentId]) {
      const parentJoint = computeBone(bone.parentId);
      parentWorldAngle = parentJoint.worldAngle;

      // Rotate pivot offset by parent world angle
      const cosP = Math.cos(parentWorldAngle);
      const sinP = Math.sin(parentWorldAngle);

      const rotatedOffsetX = bone.pivotOffset.x * cosP - bone.pivotOffset.y * sinP;
      const rotatedOffsetY = bone.pivotOffset.x * sinP + bone.pivotOffset.y * cosP;

      worldX = parentJoint.worldX + rotatedOffsetX;
      worldY = parentJoint.worldY + rotatedOffsetY;
    } else {
      // Root bone
      worldX = rootOrigin.x + bone.pivotOffset.x;
      worldY = rootOrigin.y + bone.pivotOffset.y;
    }

    const boneAngleRad = (bone.currentAngle) * DEG2RAD;
    const worldAngle = parentWorldAngle + boneAngleRad;

    const tipX = worldX + Math.cos(worldAngle) * bone.length;
    const tipY = worldY + Math.sin(worldAngle) * bone.length;

    const joint: CalculatedJoint = {
      id: bone.id,
      name: bone.name,
      parentId: bone.parentId,
      worldX,
      worldY,
      worldAngle,
      tipX,
      tipY,
      length: bone.length,
      part: bone.part,
    };

    result[id] = joint;
    return joint;
  }

  for (const bone of boneList) {
    computeBone(bone.id);
  }

  return result;
}

/**
 * Smooth cubic easing
 */
function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Evaluates the animated value for a specific track at a given frame
 */
export function evaluateTrackValue(
  keyframes: Keyframe[],
  trackId: string,
  frame: number,
  defaultValue: number | string
): number | string {
  const trackKeys = keyframes
    .filter((k) => k.trackId === trackId)
    .sort((a, b) => a.frame - b.frame);

  if (trackKeys.length === 0) return defaultValue;

  // Exact match
  const exact = trackKeys.find((k) => k.frame === frame);
  if (exact) return exact.value;

  // Before first keyframe
  if (frame <= trackKeys[0].frame) {
    return trackKeys[0].value;
  }

  // After last keyframe
  if (frame >= trackKeys[trackKeys.length - 1].frame) {
    return trackKeys[trackKeys.length - 1].value;
  }

  // Find bounding keyframes
  let prevKey = trackKeys[0];
  let nextKey = trackKeys[1];

  for (let i = 0; i < trackKeys.length - 1; i++) {
    if (trackKeys[i].frame <= frame && trackKeys[i + 1].frame >= frame) {
      prevKey = trackKeys[i];
      nextKey = trackKeys[i + 1];
      break;
    }
  }

  // For discrete values like phonemes or eye states, hold previous
  if (typeof prevKey.value === 'string' || typeof nextKey.value === 'string') {
    return prevKey.value;
  }

  // Numeric interpolation
  const span = nextKey.frame - prevKey.frame;
  if (span <= 0) return prevKey.value;

  let progress = (frame - prevKey.frame) / span;

  if (prevKey.easing === 'ease-in-out') {
    progress = easeInOut(progress);
  } else if (prevKey.easing === 'step') {
    return prevKey.value;
  }

  const startVal = Number(prevKey.value);
  const endVal = Number(nextKey.value);
  return startVal + (endVal - startVal) * progress;
}

/**
 * Get mouth SVG path data for a given phoneme viseme
 */
export function getVisemePath(viseme: PhonemeViseme, scale: number = 1): { d: string; fill: string; stroke: string } {
  switch (viseme) {
    case 'A_E': // Open vowel
      return {
        d: 'M -18 2 Q 0 -12 18 2 Q 10 16 -18 2 Z',
        fill: '#831843',
        stroke: '#1e293b',
      };
    case 'O_U': // Rounded mouth
      return {
        d: 'M -10 2 C -10 -8 10 -8 10 2 C 10 12 -10 12 -10 2 Z',
        fill: '#831843',
        stroke: '#1e293b',
      };
    case 'M_B_P': // Closed lips
      return {
        d: 'M -16 4 Q 0 0 16 4 Q 0 7 -16 4 Z',
        fill: '#f43f5e',
        stroke: '#1e293b',
      };
    case 'L_D_T': // Tongue touching roof
      return {
        d: 'M -16 2 Q 0 -8 16 2 Q 12 14 -16 2 Z',
        fill: '#831843',
        stroke: '#1e293b',
      };
    case 'F_V': // Upper teeth on lower lip
      return {
        d: 'M -16 2 L 16 2 Q 0 10 -16 2 Z',
        fill: '#ffffff',
        stroke: '#1e293b',
      };
    case 'smile': // Happy grin
      return {
        d: 'M -18 -2 Q 0 18 18 -2 Q 0 4 -18 -2 Z',
        fill: '#831843',
        stroke: '#1e293b',
      };
    case 'rest':
    default:
      return {
        d: 'M -14 4 Q 0 7 14 4',
        fill: 'none',
        stroke: '#1e293b',
      };
  }
}
