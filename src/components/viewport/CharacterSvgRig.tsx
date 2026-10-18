import React from 'react';
import { BoneNode, CharacterPalette, PhonemeViseme } from '../../types/pipeline';
import { solveForwardKinematics, getVisemePath } from '../../utils/kinematics';

interface CharacterSvgRigProps {
  bones: Record<string, BoneNode>;
  rootOffset?: { x: number; y: number };
  palette: CharacterPalette;
  viseme?: PhonemeViseme;
  eyeExpression?: 'open' | 'blink' | 'squint' | 'wide' | 'wink';
  showBonesOverlay?: boolean;
  selectedBoneId?: string | null;
  onSelectBone?: (boneId: string) => void;
  scale?: number;
}

export const CharacterSvgRig: React.FC<CharacterSvgRigProps> = ({
  bones,
  rootOffset = { x: 0, y: 0 },
  palette,
  viseme = 'rest',
  eyeExpression = 'open',
  showBonesOverlay = false,
  selectedBoneId,
  onSelectBone,
  scale = 1.0,
}) => {
  // Solve forward kinematics
  const origin = { x: 260 + rootOffset.x, y: 310 + rootOffset.y };
  const joints = solveForwardKinematics(bones, origin);

  const root = joints['root'];
  const torso = joints['torso'];
  const neck = joints['neck'];
  const head = joints['head'];
  const antenna = joints['antenna'];

  const leftShoulder = joints['left_shoulder'];
  const leftUpperArm = joints['left_upper_arm'];
  const leftForearm = joints['left_forearm'];

  const rightShoulder = joints['right_shoulder'];
  const rightUpperArm = joints['right_upper_arm'];
  const rightForearm = joints['right_forearm'];

  const leftHip = joints['left_hip'];
  const leftThigh = joints['left_thigh'];
  const leftShin = joints['left_shin'];

  const rightHip = joints['right_hip'];
  const rightThigh = joints['right_thigh'];
  const rightShin = joints['right_shin'];

  // Mouth viseme path
  const visemeData = getVisemePath(viseme);

  // Dynamic shadow squash based on root height
  const shadowY = 460;
  const shadowScaleX = Math.max(0.6, 1.0 - rootOffset.y * 0.015);
  const shadowScaleY = Math.max(0.4, 0.9 - rootOffset.y * 0.012);
  const shadowOpacity = Math.max(0.2, 0.45 - rootOffset.y * 0.005);

  return (
    <svg
      viewBox="0 0 520 520"
      className="w-full h-full select-none overflow-visible"
      style={{ transform: `scale(${scale})` }}
    >
      <defs>
        {/* Visor Gradient */}
        <radialGradient id="visorGlass" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#0284c7" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.98" />
        </radialGradient>

        {/* Visor Glare */}
        <linearGradient id="visorGlare" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Suit Shading */}
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.secondary} />
          <stop offset="100%" stopColor={palette.primary} />
        </linearGradient>

        {/* Jetpack Glow */}
        <radialGradient id="thrusterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Ground Contact Shadow */}
      <ellipse
        cx={260 + rootOffset.x * 0.4}
        cy={shadowY}
        rx={65 * shadowScaleX}
        ry={14 * shadowScaleY}
        fill="#030712"
        opacity={shadowOpacity}
      />

      {/* 2. Character Body Groups */}
      <g id="character-rig" className="transition-transform duration-75">
        
        {/* BACKPACK JETPACK (Drawn behind torso) */}
        {torso && (
          <g
            transform={`translate(${torso.worldX}, ${torso.worldY - 32}) rotate(${torso.worldAngle * 180 / Math.PI + 90})`}
          >
            <rect
              x="-24"
              y="-12"
              width="48"
              height="34"
              rx="8"
              fill="#1e293b"
              stroke={palette.outline}
              strokeWidth="3"
            />
            {/* Thruster Nozzle Left */}
            <path d="M -18 22 L -14 34 L -6 34 L -8 22 Z" fill="#475569" stroke={palette.outline} strokeWidth="2" />
            {/* Thruster Nozzle Right */}
            <path d="M 8 22 L 6 34 L 14 34 L 18 22 Z" fill="#475569" stroke={palette.outline} strokeWidth="2" />
            {/* Thruster Idle Flame */}
            <circle cx="-10" cy="38" r="5" fill="#38bdf8" opacity="0.6" />
            <circle cx="10" cy="38" r="5" fill="#38bdf8" opacity="0.6" />
          </g>
        )}

        {/* LEFT LEG (Back leg / Screen Left) */}
        {leftHip && leftThigh && leftShin && (
          <g id="limb-left-leg" className="cursor-pointer" onClick={() => onSelectBone?.('left_thigh')}>
            {/* Left Thigh */}
            <line
              x1={leftHip.worldX}
              y1={leftHip.worldY}
              x2={leftThigh.tipX}
              y2={leftThigh.tipY}
              stroke={palette.primary}
              strokeWidth="20"
              strokeLinecap="round"
            />
            <line
              x1={leftHip.worldX}
              y1={leftHip.worldY}
              x2={leftThigh.tipX}
              y2={leftThigh.tipY}
              stroke={palette.outline}
              strokeWidth="24"
              strokeLinecap="round"
              className="-z-10"
              style={{ strokeDasharray: 'none' }}
            />
            {/* Left Shin */}
            <line
              x1={leftThigh.tipX}
              y1={leftThigh.tipY}
              x2={leftShin.tipX}
              y2={leftShin.tipY}
              stroke={palette.secondary}
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Left Boot */}
            <g transform={`translate(${leftShin.tipX}, ${leftShin.tipY})`}>
              <ellipse cx="-4" cy="4" rx="16" ry="10" fill={palette.accent} stroke={palette.outline} strokeWidth="3" />
              <rect x="-18" y="10" width="28" height="6" rx="3" fill="#0f172a" />
            </g>
          </g>
        )}

        {/* RIGHT LEG (Front leg / Screen Right) */}
        {rightHip && rightThigh && rightShin && (
          <g id="limb-right-leg" className="cursor-pointer" onClick={() => onSelectBone?.('right_thigh')}>
            {/* Right Thigh */}
            <line
              x1={rightHip.worldX}
              y1={rightHip.worldY}
              x2={rightThigh.tipX}
              y2={rightThigh.tipY}
              stroke={palette.outline}
              strokeWidth="26"
              strokeLinecap="round"
            />
            <line
              x1={rightHip.worldX}
              y1={rightHip.worldY}
              x2={rightThigh.tipX}
              y2={rightThigh.tipY}
              stroke={palette.primary}
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Knee Joint */}
            <circle cx={rightThigh.tipX} cy={rightThigh.tipY} r="10" fill={palette.accent} stroke={palette.outline} strokeWidth="3" />
            {/* Right Shin */}
            <line
              x1={rightThigh.tipX}
              y1={rightThigh.tipY}
              x2={rightShin.tipX}
              y2={rightShin.tipY}
              stroke={palette.outline}
              strokeWidth="24"
              strokeLinecap="round"
            />
            <line
              x1={rightThigh.tipX}
              y1={rightThigh.tipY}
              x2={rightShin.tipX}
              y2={rightShin.tipY}
              stroke={palette.secondary}
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Right Boot */}
            <g transform={`translate(${rightShin.tipX}, ${rightShin.tipY})`}>
              <ellipse cx="6" cy="4" rx="18" ry="11" fill={palette.accent} stroke={palette.outline} strokeWidth="3" />
              <rect x="-10" y="10" width="30" height="6" rx="3" fill="#0f172a" />
            </g>
          </g>
        )}

        {/* LEFT ARM (Back arm / Screen Left) */}
        {leftShoulder && leftUpperArm && leftForearm && (
          <g id="limb-left-arm" className="cursor-pointer" onClick={() => onSelectBone?.('left_upper_arm')}>
            {/* Left Upper Arm */}
            <line
              x1={leftShoulder.worldX}
              y1={leftShoulder.worldY}
              x2={leftUpperArm.tipX}
              y2={leftUpperArm.tipY}
              stroke={palette.outline}
              strokeWidth="20"
              strokeLinecap="round"
            />
            <line
              x1={leftShoulder.worldX}
              y1={leftShoulder.worldY}
              x2={leftUpperArm.tipX}
              y2={leftUpperArm.tipY}
              stroke={palette.primary}
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Left Forearm */}
            <line
              x1={leftUpperArm.tipX}
              y1={leftUpperArm.tipY}
              x2={leftForearm.tipX}
              y2={leftForearm.tipY}
              stroke={palette.outline}
              strokeWidth="18"
              strokeLinecap="round"
            />
            <line
              x1={leftUpperArm.tipX}
              y1={leftUpperArm.tipY}
              x2={leftForearm.tipX}
              y2={leftForearm.tipY}
              stroke={palette.secondary}
              strokeWidth="13"
              strokeLinecap="round"
            />
            {/* Left Glove */}
            <circle cx={leftForearm.tipX} cy={leftForearm.tipY} r="10" fill={palette.skin} stroke={palette.outline} strokeWidth="3" />
          </g>
        )}

        {/* TORSO & SUIT */}
        {torso && root && (
          <g id="limb-torso" className="cursor-pointer" onClick={() => onSelectBone?.('torso')}>
            {/* Main Suit Body */}
            <path
              d={`
                M ${root.worldX - 32} ${root.worldY - 6}
                Q ${root.worldX - 36} ${torso.tipY + 12} ${root.worldX - 26} ${torso.tipY}
                Q ${root.worldX} ${torso.tipY - 8} ${root.worldX + 26} ${torso.tipY}
                Q ${root.worldX + 36} ${torso.tipY + 12} ${root.worldX + 32} ${root.worldY - 6}
                Q ${root.worldX} ${root.worldY + 12} ${root.worldX - 32} ${root.worldY - 6}
                Z
              `}
              fill="url(#suitGrad)"
              stroke={palette.outline}
              strokeWidth="3.5"
            />

            {/* Astronaut Utility Belt */}
            <path
              d={`
                M ${root.worldX - 30} ${root.worldY - 4}
                Q ${root.worldX} ${root.worldY + 6} ${root.worldX + 30} ${root.worldY - 4}
              `}
              stroke="#0f172a"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <rect
              x={root.worldX - 10}
              y={root.worldY - 8}
              width="20"
              height="14"
              rx="3"
              fill={palette.accent}
              stroke={palette.outline}
              strokeWidth="2.5"
            />

            {/* Suit Chest Emblem (Golden Compass Star) */}
            <g transform={`translate(${root.worldX}, ${torso.tipY + 22}) scale(0.85)`}>
              <circle cx="0" cy="0" r="12" fill="#0c4a6e" stroke={palette.outline} strokeWidth="2" />
              <polygon points="0,-9 3,-2 9,0 3,2 0,9 -3,2 -9,0 -3,-2" fill={palette.accent} />
            </g>
          </g>
        )}

        {/* HEAD & HELMET */}
        {head && neck && (
          <g id="limb-head" className="cursor-pointer" onClick={() => onSelectBone?.('head')}>
            {/* Cat Ears (Behind helmet) */}
            <polygon
              points={`${head.tipX - 44},${head.tipY - 14} ${head.tipX - 28},${head.tipY - 48} ${head.tipX - 12},${head.tipY - 30}`}
              fill={palette.primary}
              stroke={palette.outline}
              strokeWidth="3.5"
            />
            <polygon
              points={`${head.tipX - 38},${head.tipY - 18} ${head.tipX - 28},${head.tipY - 42} ${head.tipX - 18},${head.tipY - 30}`}
              fill={palette.accent}
            />

            <polygon
              points={`${head.tipX + 12},${head.tipY - 30} ${head.tipX + 28},${head.tipY - 48} ${head.tipX + 44},${head.tipY - 14}`}
              fill={palette.primary}
              stroke={palette.outline}
              strokeWidth="3.5"
            />
            <polygon
              points={`${head.tipX + 18},${head.tipY - 30} ${head.tipX + 28},${head.tipY - 42} ${head.tipX + 38},${head.tipY - 18}`}
              fill={palette.accent}
            />

            {/* Outer Helmet Sphere */}
            <circle
              cx={head.tipX}
              cy={head.tipY}
              r="48"
              fill={palette.skin}
              stroke={palette.outline}
              strokeWidth="3.5"
            />

            {/* Helmet Visor Outer Ring */}
            <rect
              x={head.tipX - 38}
              y={head.tipY - 26}
              width="76"
              height="52"
              rx="24"
              fill={palette.accent}
              stroke={palette.outline}
              strokeWidth="3"
            />

            {/* Visor Screen Glass */}
            <rect
              x={head.tipX - 34}
              y={head.tipY - 22}
              width="68"
              height="44"
              rx="20"
              fill="url(#visorGlass)"
              stroke="#0f172a"
              strokeWidth="2"
            />

            {/* Visor Glass Glare Arc */}
            <path
              d={`
                M ${head.tipX - 26} ${head.tipY - 14}
                Q ${head.tipX - 10} ${head.tipY - 18} ${head.tipX + 6} ${head.tipY - 14}
              `}
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.75"
              fill="none"
            />

            {/* Glowing Visor Digital Eyes */}
            <g id="facial-eyes" transform={`translate(${head.tipX}, ${head.tipY - 4})`}>
              {eyeExpression === 'blink' ? (
                // Closed Blinking Eyes
                <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none">
                  <path d="M -20 0 Q -13 4 -6 0" />
                  <path d="M 6 0 Q 13 4 20 0" />
                </g>
              ) : eyeExpression === 'squint' ? (
                // Playful Squint Eyes
                <g stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none">
                  <path d="M -20 2 L -13 -4 L -6 2" />
                  <path d="M 6 2 L 13 -4 L 20 2" />
                </g>
              ) : eyeExpression === 'wide' ? (
                // Wide Excited Eyes
                <g fill="#ffffff">
                  <circle cx="-13" cy="-2" r="9" />
                  <circle cx="13" cy="-2" r="9" />
                  <circle cx="-13" cy="-2" r="4.5" fill="#0284c7" />
                  <circle cx="13" cy="-2" r="4.5" fill="#0284c7" />
                  <circle cx="-11" cy="-4" r="2" fill="#ffffff" />
                  <circle cx="15" cy="-4" r="2" fill="#ffffff" />
                </g>
              ) : (
                // Default Confident Eyes
                <g fill="#ffffff">
                  <ellipse cx="-13" cy="-1" rx="7" ry="8" />
                  <ellipse cx="13" cy="-1" rx="7" ry="8" />
                  <circle cx="-12" cy="-1" r="3.5" fill="#0369a1" />
                  <circle cx="14" cy="-1" r="3.5" fill="#0369a1" />
                  <circle cx="-10" cy="-3" r="1.8" fill="#ffffff" />
                  <circle cx="16" cy="-3" r="1.8" fill="#ffffff" />
                </g>
              )}
            </g>

            {/* Digital Viseme Mouth Shape */}
            <g id="facial-mouth" transform={`translate(${head.tipX}, ${head.tipY + 11})`}>
              <path
                d={visemeData.d}
                fill={visemeData.fill}
                stroke={visemeData.stroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        )}

        {/* HELMET ANTENNA */}
        {antenna && head && (
          <g id="limb-antenna" className="cursor-pointer" onClick={() => onSelectBone?.('antenna')}>
            <line
              x1={antenna.worldX}
              y1={antenna.worldY}
              x2={antenna.tipX}
              y2={antenna.tipY}
              stroke={palette.outline}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Glowing Golden Antenna Bulb */}
            <circle cx={antenna.tipX} cy={antenna.tipY} r="7" fill={palette.accent} stroke={palette.outline} strokeWidth="2.5" />
            <circle cx={antenna.tipX - 2} cy={antenna.tipY - 2} r="2" fill="#ffffff" />
          </g>
        )}

        {/* RIGHT ARM (Front arm / Screen Right - High focal layer) */}
        {rightShoulder && rightUpperArm && rightForearm && (
          <g id="limb-right-arm" className="cursor-pointer" onClick={() => onSelectBone?.('right_upper_arm')}>
            {/* Shoulder Badge */}
            <circle cx={rightShoulder.worldX} cy={rightShoulder.worldY} r="9" fill={palette.accent} stroke={palette.outline} strokeWidth="3" />
            
            {/* Right Upper Arm */}
            <line
              x1={rightShoulder.worldX}
              y1={rightShoulder.worldY}
              x2={rightUpperArm.tipX}
              y2={rightUpperArm.tipY}
              stroke={palette.outline}
              strokeWidth="22"
              strokeLinecap="round"
            />
            <line
              x1={rightShoulder.worldX}
              y1={rightShoulder.worldY}
              x2={rightUpperArm.tipX}
              y2={rightUpperArm.tipY}
              stroke={palette.primary}
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Elbow Joint */}
            <circle cx={rightUpperArm.tipX} cy={rightUpperArm.tipY} r="8" fill={palette.accent} stroke={palette.outline} strokeWidth="2.5" />

            {/* Right Forearm */}
            <line
              x1={rightUpperArm.tipX}
              y1={rightUpperArm.tipY}
              x2={rightForearm.tipX}
              y2={rightForearm.tipY}
              stroke={palette.outline}
              strokeWidth="20"
              strokeLinecap="round"
            />
            <line
              x1={rightUpperArm.tipX}
              y1={rightUpperArm.tipY}
              x2={rightForearm.tipX}
              y2={rightForearm.tipY}
              stroke={palette.secondary}
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Right Glove with Thumb */}
            <g transform={`translate(${rightForearm.tipX}, ${rightForearm.tipY})`}>
              <circle cx="0" cy="0" r="12" fill={palette.skin} stroke={palette.outline} strokeWidth="3" />
              <circle cx="6" cy="-4" r="5" fill={palette.skin} stroke={palette.outline} strokeWidth="2.5" />
            </g>
          </g>
        )}
      </g>

      {/* 3. SKELETAL RIG & BONE OVERLAY (if active) */}
      {showBonesOverlay && (
        <g id="bones-overlay" className="pointer-events-none">
          {Object.values(joints).map((joint) => {
            if (joint.length <= 0) return null;
            const isSelected = selectedBoneId === joint.id;
            return (
              <g key={`bone-line-${joint.id}`}>
                {/* Bone Cone / Line */}
                <line
                  x1={joint.worldX}
                  y1={joint.worldY}
                  x2={joint.tipX}
                  y2={joint.tipY}
                  stroke={isSelected ? '#06b6d4' : '#ef4444'}
                  strokeWidth={isSelected ? '4' : '2'}
                  strokeDasharray={isSelected ? 'none' : '4 2'}
                  opacity={isSelected ? 1.0 : 0.75}
                />
                {/* Pivot Joint Circle */}
                <circle
                  cx={joint.worldX}
                  cy={joint.worldY}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#22d3ee' : '#f87171'}
                  stroke="#0b0f17"
                  strokeWidth="2"
                />
                {/* Tip Circle */}
                <circle
                  cx={joint.tipX}
                  cy={joint.tipY}
                  r="3.5"
                  fill="#fbbf24"
                  stroke="#0b0f17"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
};
