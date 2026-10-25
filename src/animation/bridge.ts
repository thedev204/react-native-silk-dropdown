/**
 * Worklet → RN bridge.
 * Import from Worklets when available; Reanimated re-exports the deprecated aliases.
 *
 * Always invoke these *inside* a UI worklet (e.g. a withTiming completion callback).
 */
export { scheduleOnRN, runOnJS } from 'react-native-worklets';
