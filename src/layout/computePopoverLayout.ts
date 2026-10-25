import type { PopoverLayout, PopoverLayoutInput } from '../types';

const DEFAULT_OFFSET = 6;
const DEFAULT_MIN_WIDTH = 160;
const EDGE_PADDING = 8;

/**
 * Pure layout helper for popover positioning.
 * Flips above/below the trigger based on usable space (window - keyboard - insets).
 */
export function computePopoverLayout(input: PopoverLayoutInput): PopoverLayout {
  const {
    triggerRect,
    window,
    keyboardHeight,
    insets,
    contentHeight,
    preferredPlacement = 'bottom',
    offset = DEFAULT_OFFSET,
    matchTriggerWidth = true,
    minWidth = DEFAULT_MIN_WIDTH,
    maxWidth,
  } = input;

  const usableTop = insets.top + EDGE_PADDING;
  const usableBottom =
    window.height - Math.max(keyboardHeight, 0) - insets.bottom - EDGE_PADDING;
  const usableLeft = insets.left + EDGE_PADDING;
  const usableRight = window.width - insets.right - EDGE_PADDING;

  const spaceBelow = Math.max(
    0,
    usableBottom - (triggerRect.y + triggerRect.height + offset)
  );
  const spaceAbove = Math.max(0, triggerRect.y - offset - usableTop);

  let placement = preferredPlacement;
  if (
    preferredPlacement === 'bottom' &&
    spaceBelow < Math.min(contentHeight, 120) &&
    spaceAbove > spaceBelow
  ) {
    placement = 'top';
  } else if (
    preferredPlacement === 'top' &&
    spaceAbove < Math.min(contentHeight, 120) &&
    spaceBelow > spaceAbove
  ) {
    placement = 'bottom';
  }

  const availableHeight = placement === 'bottom' ? spaceBelow : spaceAbove;
  const maxHeight = Math.max(
    80,
    Math.min(contentHeight || availableHeight, availableHeight)
  );

  const widthCap = maxWidth ?? Math.max(minWidth, usableRight - usableLeft);
  const width = matchTriggerWidth
    ? Math.min(Math.max(triggerRect.width, minWidth), widthCap)
    : Math.min(widthCap, Math.max(minWidth, triggerRect.width));

  let left = triggerRect.x;
  if (left + width > usableRight) {
    left = usableRight - width;
  }
  if (left < usableLeft) {
    left = usableLeft;
  }

  let top: number;
  if (placement === 'bottom') {
    top = triggerRect.y + triggerRect.height + offset;
  } else {
    top = triggerRect.y - offset - maxHeight;
  }

  if (top < usableTop) {
    top = usableTop;
  }
  if (top + maxHeight > usableBottom) {
    top = Math.max(usableTop, usableBottom - maxHeight);
  }

  return {
    top,
    left,
    width,
    maxHeight,
    placement,
  };
}
