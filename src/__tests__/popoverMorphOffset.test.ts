import { popoverMorphOffset } from '../animation/transitionStyles';

describe('popoverMorphOffset', () => {
  it('caps long travel toward the trigger', () => {
    const offset = popoverMorphOffset({
      triggerRect: { x: 20, y: 100, width: 200, height: 48 },
      layout: {
        top: 154,
        left: 20,
        width: 200,
        maxHeight: 280,
        placement: 'bottom',
      },
      contentHeight: 200,
    });

    // Trigger center: (120, 124); popover center: (120, 254) → capped
    expect(offset.dx).toBe(0);
    expect(offset.dy).toBe(-36);
  });

  it('falls back to maxHeight when contentHeight is 0', () => {
    const offset = popoverMorphOffset({
      triggerRect: { x: 0, y: 0, width: 100, height: 40 },
      layout: {
        top: 50,
        left: 0,
        width: 100,
        maxHeight: 100,
        placement: 'bottom',
      },
      contentHeight: 0,
    });

    expect(offset.dx).toBe(0);
    expect(offset.dy).toBe(-36);
  });

  it('preserves short travel under the cap', () => {
    const offset = popoverMorphOffset({
      triggerRect: { x: 0, y: 100, width: 80, height: 40 },
      layout: {
        top: 146,
        left: 0,
        width: 80,
        maxHeight: 16,
        placement: 'bottom',
      },
      contentHeight: 16,
    });

    // Trigger cy=120, popover cy=154 → dy=-34
    expect(offset.dx).toBe(0);
    expect(offset.dy).toBe(-34);
  });
});
