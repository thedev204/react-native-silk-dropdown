import {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  useReducedMotion,
  type EntryOrExitLayoutType,
} from 'react-native-reanimated';

export const MICRO_ENTER_MS = 180;
export const MICRO_EXIT_MS = 160;
export const MICRO_LAYOUT_MS = 180;
export const MICRO_PULSE_MS = 220;

const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

/**
 * Shared enter/exit/layout presets for selection micro-motion.
 * Returns undefined builders when reduced motion is on so mounts stay instant.
 */
export function useMicroMotion() {
  const reduced = useReducedMotion();

  if (reduced) {
    return {
      reduced: true as const,
      chipEntering: undefined as EntryOrExitLayoutType | undefined,
      chipExiting: undefined as EntryOrExitLayoutType | undefined,
      labelEntering: undefined as EntryOrExitLayoutType | undefined,
      labelExiting: undefined as EntryOrExitLayoutType | undefined,
      clearEntering: undefined as EntryOrExitLayoutType | undefined,
      clearExiting: undefined as EntryOrExitLayoutType | undefined,
      chipsLayout: undefined as
        ReturnType<typeof LinearTransition.duration> | undefined,
    };
  }

  return {
    reduced: false as const,
    chipEntering: FadeIn.duration(MICRO_ENTER_MS).easing(
      easeOut
    ) as EntryOrExitLayoutType,
    chipExiting: FadeOut.duration(MICRO_EXIT_MS).easing(
      easeInOut
    ) as EntryOrExitLayoutType,
    labelEntering: FadeIn.duration(MICRO_ENTER_MS).easing(
      easeOut
    ) as EntryOrExitLayoutType,
    labelExiting: FadeOut.duration(MICRO_EXIT_MS).easing(
      easeInOut
    ) as EntryOrExitLayoutType,
    clearEntering: FadeIn.duration(MICRO_ENTER_MS).easing(
      easeOut
    ) as EntryOrExitLayoutType,
    clearExiting: FadeOut.duration(MICRO_EXIT_MS).easing(
      easeInOut
    ) as EntryOrExitLayoutType,
    chipsLayout: LinearTransition.duration(MICRO_LAYOUT_MS).easing(easeInOut),
  };
}
