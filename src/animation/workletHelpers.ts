/**
 * Internal seam for worklet → RN bridge utilities.
 * Keep call sites on this module so a rename is a one-line fix.
 */
export { scheduleOnRN, runOnJS } from './bridge';
