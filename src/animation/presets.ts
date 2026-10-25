import { Easing } from 'react-native-reanimated';

import type { DropdownAnimation, DropdownAnimationConfig } from '../types';

export const DEFAULT_ANIMATION: Required<
  Pick<
    DropdownAnimationConfig,
    'name' | 'durationIn' | 'durationOut' | 'springDamping' | 'springStiffness'
  >
> = {
  name: 'scale',
  durationIn: 180,
  durationOut: 120,
  springDamping: 26,
  springStiffness: 220,
};

export const SHEET_ANIMATION: Required<
  Pick<DropdownAnimationConfig, 'name' | 'durationIn' | 'durationOut'>
> = {
  name: 'slide',
  durationIn: 280,
  durationOut: 220,
};

/** Soft deceleration used for sheet slide open/close. */
export const SHEET_EASING = Easing.bezier(0.32, 0.72, 0, 1);

export function resolveAnimation(
  animation: DropdownAnimation | undefined,
  presentation: 'popover' | 'sheet'
): Required<
  Pick<
    DropdownAnimationConfig,
    'name' | 'durationIn' | 'durationOut' | 'springDamping' | 'springStiffness'
  >
> {
  const base =
    presentation === 'sheet'
      ? { ...DEFAULT_ANIMATION, ...SHEET_ANIMATION }
      : { ...DEFAULT_ANIMATION };

  if (!animation) {
    return base;
  }

  if (typeof animation === 'string') {
    return { ...base, name: animation };
  }

  return {
    ...base,
    ...animation,
    name: animation.name ?? base.name,
  };
}
