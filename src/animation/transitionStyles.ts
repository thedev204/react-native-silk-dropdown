import type { DropdownAnimationName, PopoverPlacement, Rect } from '../types';
import type { PopoverLayout } from '../types';

type TransformItem =
  { translateX: number } | { translateY: number } | { scale: number };

export type TransitionStyle = {
  opacity?: number;
  transform?: TransformItem[];
};

/** Popover slide travel in px — large enough to read clearly vs fade/scale. */
const POPOVER_SLIDE_DISTANCE = 28;

/** Popover scale starts here and lands at 1 (non-morph). */
const POPOVER_SCALE_FROM = 0.86;

/** Softer scale when morphing from the trigger. */
const POPOVER_MORPH_SCALE_FROM = 0.94;

/** Cap morph travel so open doesn't leap from far below the field. */
const POPOVER_MORPH_MAX_TRAVEL = 36;

export type PopoverMorphGeometry = {
  triggerRect: Rect;
  layout: PopoverLayout;
  /** Measured content height; falls back to layout.maxHeight. */
  contentHeight: number;
};

/**
 * Delta from popover center to trigger center.
 * At progress 0 the content sits over the trigger; at 1 it is in place.
 */
export function popoverMorphOffset(geometry: PopoverMorphGeometry): {
  dx: number;
  dy: number;
} {
  'worklet';
  const { triggerRect, layout, contentHeight } = geometry;
  const height =
    contentHeight > 0 ? contentHeight : Math.max(layout.maxHeight, 1);
  const triggerCx = triggerRect.x + triggerRect.width / 2;
  const triggerCy = triggerRect.y + triggerRect.height / 2;
  const popoverCx = layout.left + layout.width / 2;
  const popoverCy = layout.top + height / 2;
  const dx = triggerCx - popoverCx;
  const dy = triggerCy - popoverCy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= POPOVER_MORPH_MAX_TRAVEL || dist === 0) {
    return { dx, dy };
  }
  const scale = POPOVER_MORPH_MAX_TRAVEL / dist;
  return { dx: dx * scale, dy: dy * scale };
}

/**
 * Popover content style for a given animation preset.
 * Intended for use inside `useAnimatedStyle` worklets.
 *
 * Presets are intentionally distinct:
 * - fade  → opacity only
 * - slide → clear vertical travel + light fade
 * - scale / spring → morph from trigger (when geometry given) or center scale
 */
export function popoverContentStyle(
  name: DropdownAnimationName,
  progress: number,
  placement: PopoverPlacement | undefined,
  morph?: PopoverMorphGeometry | null
): TransitionStyle {
  'worklet';
  const p = progress;

  if (name === 'none') {
    return { opacity: 1 };
  }

  if (name === 'fade') {
    return { opacity: p };
  }

  if (name === 'slide') {
    // Slide in from the trigger side: bottom placement rises up, top drops down.
    const dir =
      placement === 'top' ? POPOVER_SLIDE_DISTANCE : -POPOVER_SLIDE_DISTANCE;
    return {
      // Opacity reaches 0 at p=0 (no snap on unmount); rises quickly so motion reads.
      opacity: Math.min(1, p * 2),
      transform: [{ translateY: (1 - p) * dir }],
    };
  }

  // scale (default) and spring — morph from trigger when geometry is available
  const scaleFrom = morph ? POPOVER_MORPH_SCALE_FROM : POPOVER_SCALE_FROM;
  const scale = scaleFrom + p * (1 - scaleFrom);

  if (morph) {
    const { dx, dy } = popoverMorphOffset(morph);
    return {
      // Linear-ish fade so close (no morph) doesn't hold full opacity then dump.
      opacity: Math.min(1, p * 1.35),
      transform: [
        { translateX: (1 - p) * dx },
        { translateY: (1 - p) * dy },
        { scale },
      ],
    };
  }

  return {
    opacity: Math.min(1, p * 1.35),
    transform: [{ scale }],
  };
}

/**
 * Sheet content style for a given animation preset.
 * `travel` is the measured (or fallback) sheet height; `dragY` is pan offset.
 */
export function sheetContentStyle(
  name: DropdownAnimationName,
  progress: number,
  travel: number,
  dragY: number
): TransitionStyle {
  'worklet';
  const p = Math.min(1, Math.max(0, progress));

  if (name === 'none') {
    return { opacity: 1 };
  }

  if (name === 'fade') {
    return {
      opacity: p,
      transform: [{ translateY: dragY }],
    };
  }

  if (name === 'scale' || name === 'spring') {
    return {
      // Stay invisible at p=0 so a cold Modal first frame can't flash at rest.
      opacity: p <= 0 ? 0 : 1,
      transform: [
        { translateY: (1 - p) * travel + dragY },
        { scale: 0.88 + p * 0.12 },
      ],
    };
  }

  // slide (sheet default)
  return {
    opacity: p <= 0 ? 0 : 1,
    transform: [{ translateY: (1 - p) * travel + dragY }],
  };
}
