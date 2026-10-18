# Character Animation Pipeline Studio

A professional web-based studio and execution workbench for local, reusable cartoon character animation. This pipeline translates story scripts and scene staging into modular character specs, skeletal rigs, pose libraries, action timelines, and deterministic browser-rendered animations (SVG, Canvas 2D, and Remotion/HyperFrames JSON timeline export) without relying on non-deterministic remote video generation.

## User Review & Critical Decisions

> [!IMPORTANT]
> The studio prioritizes deterministic, reusable local motion mechanics over generative video black-boxes. All character parts, skeletal joints, and animation timelines are mathematically precise, inspectable, and editable.

- **Confirmed Decision 1 (Runtime Architecture)**: Multi-runtime architecture enabled. Users can preview and test rigs in an interactive SVG modular vector viewer, toggle a 60fps HTML5 Canvas skeletal solver, and inspect/export Remotion & HyperFrames timeline JSON compositions.
- **Confirmed Decision 2 (Workflow & Layout)**: Interactive Director Workbench layout. An 11-stage pipeline navigator with dedicated director workspaces, automated reviewer checks (`meta/reviewer`), and explicit human approval gates (`meta/checkpoint-protocol`).
- **Confirmed Decision 3 (Preset & Demo)**: Preloaded with "Pip the Space Scout" (a whimsical modular sci-fi cartoon character with full skeletal bones, 6 reusable poses, walk/jump cycles, and 5 facial phoneme visemes), alongside blank slate project creation.

---

## 1. Overview & Core Concept

### What It Does
The studio provides an end-to-end 11-stage production pipeline for 2D cartoon characters:
1. **Research (`research-director`)**: Visual references, art style bible, motion physics, proportion grids, and animation frame-rate targets (12fps twos / 24fps / 60fps).
2. **Proposal (`proposal-director`) [Approval Gate]**: Creative brief, visual language agreement, motion mechanics thesis, and milestone timeline.
3. **Sample [Approval Gate]**: Quick 2-second key motion test slice to validate joint deformation and silhouette balance before scripting.
4. **Script (`script-director`) [Approval Gate]**: Action-annotated screenplay, dialogue phoneme cue marks, and camera beat sheet.
5. **Character Design (`character-design-director`) [Approval Gate]**: Turnaround sheets, vector art assets, color palettes, and facial expression phonemes (neutral, open, wide, smile, round).
6. **Rig Plan (`rig-plan-director`)**: Bone hierarchy (root -> hips -> spine -> neck -> head; root -> shoulders -> arms; root -> pelvis -> legs), pivot points, and rotation constraints.
7. **Scene Plan (`scene-director`) [Approval Gate]**: Multiplane camera staging (Foreground, Midground character plane, Background), parallax depth, and focal framing.
8. **Assets (`asset-director`) [Approval Gate]**: Componentized SVG sprite library (vector paths, layered groups, z-index hierarchy, anchor pins).
9. **Edit (`edit-director`)**: Dope sheet and action timeline editor with keyframe track controls, cubic bezier easing curves, and audio/beat synchronization markers.
10. **Compose (`compose-director`)**: Multi-layer compositing, ambient stage lighting, particle/accent overlays, and real-time playback synchronization.
11. **Publish (`publish-director`) [Approval Gate]**: Multi-format packaging:
    - Interactive SVG player with live joint/bone overlays.
    - Canvas 2D hardware-accelerated playback.
    - Remotion-ready TypeScript/React composition snippet.
    - Deterministic HyperFrames JSON timeline bundle ready for local headless rendering.

### Target Audience & Persona
- **Animators & Technical Directors**: Needing consistent character assets that do not morph between cuts.
- **Web & Interactive Developers**: Building high-performance, deterministic SVG/Canvas interactive cartoon experiences.
- **Video Producers**: Creating episodic cartoon content with local rendering speed and zero GPU video-gen hallucination.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Pipeline Overview & Executive Control**:
   - The top control bar displays the overall project status, active stage indicator, and checkpoint validation status.
   - The left sidebar provides the 11-stage director navigation, with visual badges indicating stage status (`Draft`, `Under Review`, `Approved`, `Changes Requested`).
2. **Stage Workspaces**:
   - Each stage opens a purpose-built director workspace with tailored inputs, visual inspectors, reviewer audits, and action triggers.
   - Stages with approval gates display a formal Checkpoint Protocol bar where the Executive Producer can approve, reject, or request revisions with notes.
3. **Rig & Pose Inspector**:
   - An interactive viewport allows selecting character bones, testing forward kinematics (FK) rotation sliders, switching poses from the pose library (Idle, Walk Contact, Walk Pass, Excited Wave, Crouch Jump, Surprised), and previewing mouth visemes.
4. **Interactive Timeline & Dope Sheet**:
   - Multi-track timeline (Root, Torso, Head, Left Arm, Right Arm, Legs, Mouth Viseme, Camera) with draggable playhead, loop controls, frame-step buttons, and zoomable time ticks.
5. **Runtime Comparison & Code Exporter**:
   - Instant switcher between SVG vector engine, Canvas 2D engine, and Remotion/HyperFrames JSON format with copyable code and bundle download.

### Visual Identity & Theme
- **Aesthetic Direction**: High-end animation engineering studio (dark slate foundation, crisp geometric structure, studio-grade telemetry typography, and subtle accent accents).
- **Color Palette**:
  - Neutral Canvas: Deep dark slate `#0B0F17` and structural surface `#131B2B`.
  - Border & Hairlines: Ultra-subtle slate `#1E293B` and `#334155`.
  - Primary Accent: Precision animation cyan `#06B6D4` / electric blue `#3B82F6`.
  - Approval Accents: Muted emerald `#10B981` (Approved), Amber `#F59E0B` (Pending Review), Crimson `#EF4444` (Revision Required).
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` for crisp studio typography.
  - Body & Form Controls: `DM Sans` for high legibility.
  - Timecode & Keyframes: `JetBrains Mono` / `tabular-nums` for precise frame numbers, second counters, and joint angle telemetry.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Deterministic Modular SVG/Canvas Rigging vs. AI Video Generation**:
  - *Chosen Approach*: Hierarchical bone-and-pivot 2D vector kinematics. Character parts (head, limbs, eyes, mouth) are discrete vector nodes connected through transformation matrices.
  - *Why*: Delivers 100% deterministic, reusable characters that maintain identity, line weight, and color consistency across infinite frames, without temporal flickering or cloud generation costs.
- **Decision 2: 11-Stage Pipeline with Checkpoint Protocol**:
  - *Chosen Approach*: Comprehensive director stage navigation reflecting production animation pipelines with automated validation criteria (`meta/reviewer`) and human gate sign-off (`meta/checkpoint-protocol`).
  - *Why*: Prevents wasting time creating assets or editing timelines before character designs, scripts, and rig hierarchies are locked in.
- **Decision 3: Multi-Runtime Selector**:
  - *Chosen Approach*: Provide simultaneous support for SVG (DOM-inspectable, scalable), Canvas 2D (high-performance bulk rendering), and Remotion/HyperFrames (deterministic code generation for video rendering pipelines).

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Executive Producer Bar                             │
│  [Project: Pip the Scout] [Stage: 6. Rig Plan] [FPS: 24] [Status: Active]│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴────────────────────────┐
         ▼                                                  ▼
┌───────────────────────────────┐  ┌────────────────────────────────────┐
│      11-Stage Pipeline        │  │       Active Stage Workspace       │
│  01. Research                 │  │                                    │
│  02. Proposal [Gate]          │  │  ┌──────────────────────────────┐  │
│  03. Sample [Gate]            │  │  │ Visual Viewport / Animator   │  │
│  04. Script [Gate]            │  │  │  - SVG Vector Rig Solver     │  │
│  05. Character Design [Gate]  │  │  │  - Canvas 2D Skeletal Render │  │
│  06. Rig Plan                 │  │  │  - Bone & Pivot Overlays     │  │
│  07. Scene Plan [Gate]        │  │  └──────────────────────────────┘  │
│  08. Assets [Gate]            │  │  ┌──────────────────────────────┐  │
│  09. Edit (Dope Sheet)        │  │  │ Dope Sheet / Action Timeline │  │
│  10. Compose                  │  │  │ Keyframe tracks & Easing     │  │
│  11. Publish [Gate]           │  │  └──────────────────────────────┘  │
│                               │  │  ┌──────────────────────────────┐  │
│  [Reviewer Validation Box]    │  │  │ Director Control & Inspector │  │
│  [Checkpoint Sign-off Gate]   │  │  │ Properties, Poses, Phonemes  │  │
└───────────────────────────────┘  └────────────────────────────────────┘
```

### Data Model & State Strategy
- **Character Spec**: Identity, name, style guide, scale factor, color palette (Primary, Secondary, Accent, Line, Skin).
- **Rig Hierarchy**: Tree of nodes (id, name, parentId, pivot: {x, y}, length, defaultRotation, constraints: {min, max}, currentRotation).
- **Pose Library**: Dictionary of named poses (`idle`, `walk_1`, `walk_2`, `jump_up`, `celebrate`, `thinking`) mapping joint names to target rotations and visemes.
- **Phoneme Viseme Set**: Mouth shapes mapped to speech sounds (`rest`, `A_E`, `O_U`, `M_B_P`, `L_D_T`, `F_V`).
- **Action Timeline**: Sequences of keyframes across tracks, duration in frames, playback fps (12 / 24 / 30 / 60), playhead position, loop state.
- **Stage Metadata & Approvals**: 11 stages with director name, status (`draft`, `review`, `approved`), audit checklist, approval timestamp, and reviewer feedback notes.
- **Export Packages**: Generates copyable Remotion React component code, HyperFrames JSON schema, and standalone SVG/Canvas code.

---

## 5. Implementation Sequence

1. **State Store & Type Definitions**: Full TypeScript definitions for characters, rigs, bones, keyframes, timeline tracks, and 11 director stages.
2. **Cartoon Rig Engine & Mathematical Kinematics**:
   - Forward kinematics solver for 2D character joints with hierarchical matrix propagation.
   - SVG vector character renderer with dynamic bone transformations and sprite layering.
   - HTML5 Canvas 2D skeletal renderer with bone overlay toggling.
3. **Pipeline Stages & Director Interfaces**:
   - Executive Producer dashboard & 11-stage navigation rail.
   - Stage-specific director panels (Research notes, Proposal brief, Sample clip player, Script screenplay with phoneme markers, Character turnaround visualizer, Rig bone hierarchy editor, Scene multiplane staging, Asset decomposed SVG parts library, Edit timeline dope sheet, Compose layer mixer, Publish multi-runtime code generator).
4. **Approval Gate & Reviewer Engine (`meta/reviewer` & `meta/checkpoint-protocol`)**:
   - Automated checklist validation per stage before passing to approval.
   - Interactive Sign-off / Request Revision workflow with history log.
5. **Interactive Timeline & Playback Controller**:
   - Scrubber, Play/Pause, Loop, FPS selector, keyframe addition, and pose snapping.
6. **Publish & Runtime Exporter**:
   - Remotion composition code generation, HyperFrames JSON bundle download, and SVG bundle export.
