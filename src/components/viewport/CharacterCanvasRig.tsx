import React, { useEffect, useRef } from 'react';
import { BoneNode, CharacterPalette, PhonemeViseme } from '../../types/pipeline';
import { solveForwardKinematics } from '../../utils/kinematics';

interface CharacterCanvasRigProps {
  bones: Record<string, BoneNode>;
  rootOffset?: { x: number; y: number };
  palette: CharacterPalette;
  viseme?: PhonemeViseme;
  eyeExpression?: 'open' | 'blink' | 'squint' | 'wide' | 'wink';
  showBonesOverlay?: boolean;
  selectedBoneId?: string | null;
}

export const CharacterCanvasRig: React.FC<CharacterCanvasRigProps> = ({
  bones,
  rootOffset = { x: 0, y: 0 },
  palette,
  viseme = 'rest',
  eyeExpression = 'open',
  showBonesOverlay = true,
  selectedBoneId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const width = 520;
    const height = 520;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Calculate Kinematics
    const origin = { x: 260 + rootOffset.x, y: 310 + rootOffset.y };
    const joints = solveForwardKinematics(bones, origin);

    // 1. Draw Ground Contact Shadow
    const shadowY = 460;
    const shadowScaleX = Math.max(0.6, 1.0 - rootOffset.y * 0.015);
    const shadowScaleY = Math.max(0.4, 0.9 - rootOffset.y * 0.012);

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(
      260 + rootOffset.x * 0.4,
      shadowY,
      65 * shadowScaleX,
      14 * shadowScaleY,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(3, 7, 18, 0.45)';
    ctx.fill();
    ctx.restore();

    // 2. Draw Limbs
    const drawLimb = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      width: number,
      color: string,
      outlineColor: string = palette.outline
    ) => {
      // Outline
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = width + 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Core
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    // Draw Left Leg
    const leftHip = joints['left_hip'];
    const leftThigh = joints['left_thigh'];
    const leftShin = joints['left_shin'];
    if (leftHip && leftThigh && leftShin) {
      drawLimb(leftHip.worldX, leftHip.worldY, leftThigh.tipX, leftThigh.tipY, 18, palette.primary);
      drawLimb(leftThigh.tipX, leftThigh.tipY, leftShin.tipX, leftShin.tipY, 16, palette.secondary);
      // Boot
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(leftShin.tipX - 4, leftShin.tipY + 4, 16, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = palette.accent;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = palette.outline;
      ctx.stroke();
      ctx.restore();
    }

    // Draw Right Leg
    const rightHip = joints['right_hip'];
    const rightThigh = joints['right_thigh'];
    const rightShin = joints['right_shin'];
    if (rightHip && rightThigh && rightShin) {
      drawLimb(rightHip.worldX, rightHip.worldY, rightThigh.tipX, rightThigh.tipY, 20, palette.primary);
      drawLimb(rightThigh.tipX, rightThigh.tipY, rightShin.tipX, rightShin.tipY, 18, palette.secondary);
      // Boot
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(rightShin.tipX + 6, rightShin.tipY + 4, 18, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = palette.accent;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = palette.outline;
      ctx.stroke();
      ctx.restore();
    }

    // Draw Left Arm
    const leftShoulder = joints['left_shoulder'];
    const leftUpperArm = joints['left_upper_arm'];
    const leftForearm = joints['left_forearm'];
    if (leftShoulder && leftUpperArm && leftForearm) {
      drawLimb(leftShoulder.worldX, leftShoulder.worldY, leftUpperArm.tipX, leftUpperArm.tipY, 15, palette.primary);
      drawLimb(leftUpperArm.tipX, leftUpperArm.tipY, leftForearm.tipX, leftForearm.tipY, 13, palette.secondary);
      // Glove
      ctx.beginPath();
      ctx.arc(leftForearm.tipX, leftForearm.tipY, 10, 0, Math.PI * 2);
      ctx.fillStyle = palette.skin;
      ctx.fill();
      ctx.strokeStyle = palette.outline;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw Torso
    const root = joints['root'];
    const torso = joints['torso'];
    if (root && torso) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(root.worldX - 30, root.worldY - 6);
      ctx.bezierCurveTo(root.worldX - 36, torso.tipY + 12, root.worldX - 26, torso.tipY, root.worldX, torso.tipY - 8);
      ctx.bezierCurveTo(root.worldX + 26, torso.tipY, root.worldX + 36, torso.tipY + 12, root.worldX + 30, root.worldY - 6);
      ctx.bezierCurveTo(root.worldX + 20, root.worldY + 12, root.worldX - 20, root.worldY + 12, root.worldX - 30, root.worldY - 6);
      ctx.fillStyle = palette.primary;
      ctx.fill();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = palette.outline;
      ctx.stroke();

      // Belt
      ctx.beginPath();
      ctx.ellipse(root.worldX, root.worldY - 2, 28, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.fillStyle = palette.accent;
      ctx.fillRect(root.worldX - 10, root.worldY - 7, 20, 12);
      ctx.strokeRect(root.worldX - 10, root.worldY - 7, 20, 12);
      ctx.restore();
    }

    // Draw Head & Visor
    const head = joints['head'];
    if (head) {
      ctx.save();
      // Outer Helmet
      ctx.beginPath();
      ctx.arc(head.tipX, head.tipY, 48, 0, Math.PI * 2);
      ctx.fillStyle = palette.skin;
      ctx.fill();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = palette.outline;
      ctx.stroke();

      // Visor Rim
      ctx.beginPath();
      ctx.roundRect(head.tipX - 38, head.tipY - 26, 76, 52, 24);
      ctx.fillStyle = palette.accent;
      ctx.fill();
      ctx.strokeStyle = palette.outline;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Visor Screen
      ctx.beginPath();
      ctx.roundRect(head.tipX - 34, head.tipY - 22, 68, 44, 20);
      const visorGrad = ctx.createRadialGradient(
        head.tipX - 10,
        head.tipY - 10,
        5,
        head.tipX,
        head.tipY,
        40
      );
      visorGrad.addColorStop(0, '#38bdf8');
      visorGrad.addColorStop(0.7, '#0284c7');
      visorGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = visorGrad;
      ctx.fill();

      // Visor Eyes
      ctx.fillStyle = '#ffffff';
      if (eyeExpression === 'wide') {
        ctx.beginPath();
        ctx.arc(head.tipX - 13, head.tipY - 6, 9, 0, Math.PI * 2);
        ctx.arc(head.tipX + 13, head.tipY - 6, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(head.tipX - 13, head.tipY - 6, 4.5, 0, Math.PI * 2);
        ctx.arc(head.tipX + 13, head.tipY - 6, 4.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.ellipse(head.tipX - 13, head.tipY - 5, 7, 8, 0, 0, Math.PI * 2);
        ctx.ellipse(head.tipX + 13, head.tipY - 5, 7, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0369a1';
        ctx.beginPath();
        ctx.arc(head.tipX - 12, head.tipY - 5, 3.5, 0, Math.PI * 2);
        ctx.arc(head.tipX + 14, head.tipY - 5, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mouth indicator
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (viseme === 'A_E' || viseme === 'smile') {
        ctx.arc(head.tipX, head.tipY + 9, 9, 0, Math.PI);
      } else if (viseme === 'O_U') {
        ctx.arc(head.tipX, head.tipY + 11, 5, 0, Math.PI * 2);
      } else {
        ctx.moveTo(head.tipX - 12, head.tipY + 12);
        ctx.lineTo(head.tipX + 12, head.tipY + 12);
      }
      ctx.stroke();

      ctx.restore();
    }

    // Draw Right Arm (Foreground)
    const rightShoulder = joints['right_shoulder'];
    const rightUpperArm = joints['right_upper_arm'];
    const rightForearm = joints['right_forearm'];
    if (rightShoulder && rightUpperArm && rightForearm) {
      drawLimb(rightShoulder.worldX, rightShoulder.worldY, rightUpperArm.tipX, rightUpperArm.tipY, 17, palette.primary);
      drawLimb(rightUpperArm.tipX, rightUpperArm.tipY, rightForearm.tipX, rightForearm.tipY, 15, palette.secondary);
      // Right Glove
      ctx.beginPath();
      ctx.arc(rightForearm.tipX, rightForearm.tipY, 12, 0, Math.PI * 2);
      ctx.fillStyle = palette.skin;
      ctx.fill();
      ctx.strokeStyle = palette.outline;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // 3. Draw Bones & Joints Overlay
    if (showBonesOverlay) {
      ctx.save();
      Object.values(joints).forEach((joint) => {
        if (joint.length <= 0) return;
        const isSelected = selectedBoneId === joint.id;

        // Bone connecting line
        ctx.beginPath();
        ctx.setLineDash(isSelected ? [] : [4, 2]);
        ctx.moveTo(joint.worldX, joint.worldY);
        ctx.lineTo(joint.tipX, joint.tipY);
        ctx.strokeStyle = isSelected ? '#06b6d4' : '#ef4444';
        ctx.lineWidth = isSelected ? 4 : 2;
        ctx.stroke();

        // Joint Pivot Point
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.arc(joint.worldX, joint.worldY, isSelected ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#22d3ee' : '#f87171';
        ctx.fill();
        ctx.strokeStyle = '#0b0f17';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      ctx.restore();
    }
  }, [bones, rootOffset, palette, viseme, eyeExpression, showBonesOverlay, selectedBoneId]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: '520px', maxHeight: '520px' }}
        className="w-full h-full select-none"
      />
      <div className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 backdrop-blur border border-slate-800 rounded text-[11px] font-mono text-cyan-400">
        CANVAS 2D 60FPS ENGINE
      </div>
    </div>
  );
};
