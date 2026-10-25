import { computePopoverLayout } from '../layout/computePopoverLayout';

const base = {
  triggerRect: { x: 20, y: 200, width: 200, height: 48 },
  window: { width: 390, height: 844 },
  keyboardHeight: 0,
  insets: { top: 47, right: 0, bottom: 34, left: 0 },
  contentHeight: 300,
};

describe('computePopoverLayout', () => {
  it('places the popover below the trigger when there is room', () => {
    const layout = computePopoverLayout({
      ...base,
      preferredPlacement: 'bottom',
    });

    expect(layout.placement).toBe('bottom');
    expect(layout.top).toBeGreaterThan(
      base.triggerRect.y + base.triggerRect.height
    );
    expect(layout.width).toBe(base.triggerRect.width);
    expect(layout.maxHeight).toBeGreaterThan(0);
  });

  it('flips above when space below is tight and space above is larger', () => {
    const layout = computePopoverLayout({
      ...base,
      triggerRect: { x: 20, y: 700, width: 200, height: 48 },
      preferredPlacement: 'bottom',
      contentHeight: 280,
    });

    expect(layout.placement).toBe('top');
    expect(layout.top).toBeLessThan(700);
  });

  it('reduces maxHeight when the keyboard covers the lower area', () => {
    const withoutKeyboard = computePopoverLayout({
      ...base,
      preferredPlacement: 'bottom',
    });
    const withKeyboard = computePopoverLayout({
      ...base,
      preferredPlacement: 'bottom',
      keyboardHeight: 320,
    });

    expect(withKeyboard.maxHeight).toBeLessThan(withoutKeyboard.maxHeight);
  });

  it('keeps the popover within horizontal bounds', () => {
    const layout = computePopoverLayout({
      ...base,
      triggerRect: { x: 300, y: 200, width: 200, height: 48 },
      window: { width: 390, height: 844 },
    });

    expect(layout.left + layout.width).toBeLessThanOrEqual(390 - 8);
    expect(layout.left).toBeGreaterThanOrEqual(8);
  });

  it('honors preferred top placement when space allows', () => {
    const layout = computePopoverLayout({
      ...base,
      triggerRect: { x: 20, y: 400, width: 200, height: 48 },
      preferredPlacement: 'top',
      contentHeight: 200,
    });

    expect(layout.placement).toBe('top');
  });
});
