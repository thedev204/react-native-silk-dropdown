import { useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { resolveAnimation } from '../animation/presets';
import { popoverContentStyle } from '../animation/transitionStyles';
import { computePopoverLayout } from '../layout/computePopoverLayout';
import { useKeyboardInset } from '../layout/useKeyboardInset';
import { useDropdownTheme } from '../theme/DropdownProvider';
import type {
  DropdownAnimation,
  PopoverLayout,
  PopoverPlacement,
  Rect,
} from '../types';
import { useSafeInsets } from './useSafeInsets';

type Props = {
  visible: boolean;
  progress: SharedValue<number>;
  triggerRect: Rect | null;
  animation?: DropdownAnimation;
  preferredPlacement?: PopoverPlacement;
  /** When true, keep the last layout so keyboard dismiss mid-close doesn't jump. */
  freezeLayout?: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  backdropStyle?: object;
};

export function PopoverPresenter({
  visible,
  progress,
  triggerRect,
  animation,
  preferredPlacement,
  freezeLayout = false,
  onRequestClose,
  children,
  backdropStyle,
}: Props) {
  const { tokens } = useDropdownTheme();
  const window = useWindowDimensions();
  const insets = useSafeInsets();
  const keyboardHeight = useKeyboardInset();
  const [contentHeight, setContentHeight] = useState(280);
  const frozenLayoutRef = useRef<PopoverLayout | null>(null);
  const frozenTriggerRef = useRef<Rect | null>(null);
  const config = useMemo(
    () => resolveAnimation(animation, 'popover'),
    [animation]
  );

  if (!freezeLayout && triggerRect) {
    frozenTriggerRef.current = triggerRect;
  }

  const morphTrigger = freezeLayout
    ? (frozenTriggerRef.current ?? triggerRect)
    : triggerRect;

  const liveLayout = useMemo(() => {
    if (!morphTrigger) {
      return null;
    }
    return computePopoverLayout({
      triggerRect: morphTrigger,
      window: { width: window.width, height: window.height },
      keyboardHeight,
      insets,
      contentHeight,
      preferredPlacement,
    });
  }, [
    contentHeight,
    insets,
    keyboardHeight,
    morphTrigger,
    preferredPlacement,
    window.height,
    window.width,
  ]);

  if (!freezeLayout && liveLayout) {
    frozenLayoutRef.current = liveLayout;
  }

  const layout = freezeLayout
    ? (frozenLayoutRef.current ?? liveLayout)
    : liveLayout;

  // Morph only on open — closing scales/fades in place so it doesn't fly back into the trigger.
  const useMorph =
    !freezeLayout && (config.name === 'scale' || config.name === 'spring');

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value * (config.name === 'none' ? 0 : 0.2),
  }));

  const contentAnimatedStyle = useAnimatedStyle(() =>
    popoverContentStyle(
      config.name,
      progress.value,
      layout?.placement,
      useMorph && morphTrigger && layout
        ? {
            triggerRect: morphTrigger,
            layout,
            contentHeight,
          }
        : null
    )
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={styles.root} pointerEvents="box-none">
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onRequestClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss dropdown"
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: tokens.colors.backdrop },
              backdropStyle,
              backdropAnimatedStyle,
            ]}
          />
        </Pressable>

        {layout ? (
          <Animated.View
            style={[
              styles.content,
              {
                top: layout.top,
                left: layout.left,
                width: layout.width,
                maxHeight: layout.maxHeight,
                borderRadius: tokens.radii.md,
                backgroundColor: tokens.colors.surface,
                ...tokens.elevation.content,
              },
              contentAnimatedStyle,
            ]}
            onLayout={(event) => {
              if (freezeLayout) {
                return;
              }
              const next = event.nativeEvent.layout.height;
              setContentHeight((prev) =>
                Math.abs(prev - next) < 1 ? prev : next
              );
            }}
          >
            <View style={{ maxHeight: layout.maxHeight }}>{children}</View>
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    overflow: 'hidden',
  },
});
