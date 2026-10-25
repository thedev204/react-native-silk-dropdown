import { useCallback, useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import type { DropdownAnimationConfig, DropdownPhase } from '../types';
import { SHEET_EASING } from './presets';
import { scheduleOnRN } from './bridge';

type Args = {
  phase: DropdownPhase;
  /**
   * When false, opening is held at progress 0 (e.g. sheet waiting on first layout).
   * Closing always runs. Defaults to true.
   */
  ready?: boolean;
  config: Required<
    Pick<
      DropdownAnimationConfig,
      | 'name'
      | 'durationIn'
      | 'durationOut'
      | 'springDamping'
      | 'springStiffness'
    >
  >;
  onOpened: () => void;
  onClosed: () => void;
};

export function useDropdownProgress({
  phase,
  ready = true,
  config,
  onOpened,
  onClosed,
}: Args): SharedValue<number> {
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  const finishOpen = useCallback(() => {
    onOpened();
  }, [onOpened]);

  const finishClose = useCallback(() => {
    onClosed();
  }, [onClosed]);

  useEffect(() => {
    cancelAnimation(progress);

    if (phase === 'closed') {
      progress.value = 0;
      return;
    }

    if (phase !== 'opening' && phase !== 'closing') {
      return;
    }

    const opening = phase === 'opening';

    // Hold the sheet off-screen until the presenter has measured / mounted.
    if (opening && !ready) {
      progress.value = 0;
      return;
    }

    const toValue = opening ? 1 : 0;
    const onFinish = opening ? finishOpen : finishClose;

    if (reducedMotion || config.name === 'none') {
      progress.value = toValue;
      onFinish();
      return;
    }

    if (config.name === 'spring' && opening) {
      progress.value = withSpring(
        toValue,
        {
          damping: config.springDamping,
          stiffness: config.springStiffness,
          overshootClamping: true,
        },
        (finished) => {
          'worklet';
          if (finished) {
            scheduleOnRN(onFinish);
          }
        }
      );
      return;
    }

    // Open decelerates into place; close uses a soft in-out so scale/fade doesn't rush.
    // Sheet slide keeps soft bezier both ways for a heavier panel feel.
    const useSheetEasing = config.name === 'slide';
    const easing = useSheetEasing
      ? SHEET_EASING
      : opening
        ? Easing.out(Easing.cubic)
        : Easing.inOut(Easing.cubic);

    progress.value = withTiming(
      toValue,
      {
        duration: opening ? config.durationIn : config.durationOut,
        easing,
      },
      (finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(onFinish);
        }
      }
    );
  }, [
    config.durationIn,
    config.durationOut,
    config.name,
    config.springDamping,
    config.springStiffness,
    finishClose,
    finishOpen,
    phase,
    progress,
    ready,
    reducedMotion,
  ]);

  return progress;
}
