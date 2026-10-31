import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import {
  BackHandler,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { resolveAnimation } from '../animation/presets';
import { sheetContentStyle } from '../animation/transitionStyles';
import { useKeyboardInset } from '../layout/useKeyboardInset';
import { useDropdownTheme } from '../theme/DropdownProvider';
import type { DropdownAnimation, DropdownStyles } from '../types';
import { useSafeInsets } from './useSafeInsets';

const HANDLE_AREA_HEIGHT = 20;

type Props = {
  visible: boolean;
  progress: SharedValue<number>;
  animation?: DropdownAnimation;
  maxHeightRatio?: number;
  onRequestClose: () => void;
  /** Fired once per open after layout has settled (starts the enter animation). */
  onReady?: () => void;
  children: ReactNode;
  styles?: DropdownStyles;
};

export function SheetPresenter({
  visible,
  progress,
  animation,
  maxHeightRatio = 0.85,
  onRequestClose,
  onReady,
  children,
  styles: slotStyles,
}: Props) {
  const { tokens } = useDropdownTheme();
  const window = useWindowDimensions();
  const insets = useSafeInsets();
  const keyboardHeight = useKeyboardInset();
  const dragY = useSharedValue(0);
  /** Measured height — used for drag-dismiss math only. */
  const sheetHeight = useSharedValue(0);
  const readyRef = useRef(false);
  const readyFrameRef = useRef<number | null>(null);
  const closingRef = useRef(onRequestClose);
  closingRef.current = onRequestClose;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const config = useMemo(
    () => resolveAnimation(animation, 'sheet'),
    [animation]
  );

  const maxHeight = window.height * maxHeightRatio;
  const availableHeight = Math.max(
    200,
    window.height - keyboardHeight - insets.top - 12
  );
  const sheetMaxHeight = Math.min(maxHeight, availableHeight);
  const paddingBottom = Math.max(insets.bottom, 12);
  const contentMaxHeight = Math.max(
    120,
    sheetMaxHeight - HANDLE_AREA_HEIGHT - paddingBottom
  );

  const sheetMaxHeightRef = useRef(sheetMaxHeight);
  sheetMaxHeightRef.current = sheetMaxHeight;
  /**
   * Frozen enter/exit travel. Re-captured in markReady so inset/window churn
   * on a cold first Modal present can't change translate mid-flight.
   */
  const travelSV = useSharedValue(sheetMaxHeight);

  const cancelReadyFrame = () => {
    if (readyFrameRef.current != null) {
      cancelAnimationFrame(readyFrameRef.current);
      readyFrameRef.current = null;
    }
  };

  const markReady = () => {
    if (readyRef.current) {
      return;
    }
    readyRef.current = true;
    // Freeze travel at the moment we start entering.
    travelSV.value = sheetMaxHeightRef.current;
    onReadyRef.current?.();
  };

  useEffect(() => {
    if (!visible) {
      cancelReadyFrame();
      sheetHeight.value = 0;
      dragY.value = 0;
      readyRef.current = false;
      return;
    }

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      closingRef.current();
      return true;
    });
    return () => {
      cancelReadyFrame();
      sub.remove();
    };
  }, [dragY, sheetHeight, visible]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
        onPanResponderMove: (_, gesture) => {
          dragY.value = Math.max(0, gesture.dy);
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 80 || gesture.vy > 0.9) {
            const measured = sheetHeight.value;
            const travel =
              measured > 0
                ? measured
                : travelSV.value > 0
                  ? travelSV.value
                  : sheetMaxHeight;
            const currentDrag = Math.max(0, gesture.dy);

            // Fold the drag offset into progress so the close animation
            // continues from the dragged position instead of jumping back up.
            if (config.name === 'fade') {
              dragY.value = withTiming(Math.max(currentDrag, travel), {
                duration: 200,
              });
            } else if (travel > 0 && currentDrag > 0) {
              progress.value = Math.max(0, 1 - currentDrag / travel);
              dragY.value = 0;
            } else {
              dragY.value = 0;
            }

            closingRef.current();
            return;
          }
          dragY.value = withTiming(0, { duration: 160 });
        },
      }),
    [config.name, dragY, progress, sheetHeight, sheetMaxHeight, travelSV]
  );

  const onSheetLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.height;
    if (next <= 0) {
      return;
    }
    sheetHeight.value = next;

    if (readyRef.current || readyFrameRef.current != null) {
      return;
    }

    // Cold first open: FlatList / Modal insets often remasure on the next
    // frame. Wait two frames after the first real layout before starting enter.
    readyFrameRef.current = requestAnimationFrame(() => {
      readyFrameRef.current = requestAnimationFrame(() => {
        readyFrameRef.current = null;
        markReady();
      });
    });
  };

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const p = Math.min(1, Math.max(0, progress.value));
    return { opacity: p };
  });

  const sheetAnimatedStyle = useAnimatedStyle(() => {
    return sheetContentStyle(
      config.name,
      progress.value,
      travelSV.value,
      dragY.value
    );
  });

  // Guaranteed off-screen before Reanimated binds (cold Modal first paint).
  const offscreenY = Math.max(sheetMaxHeight, window.height);

  const sheetChromeStyle = useMemo(
    () => ({
      maxHeight: sheetMaxHeight,
      paddingBottom,
      backgroundColor: tokens.colors.surface,
      borderTopLeftRadius: tokens.radii.lg,
      borderTopRightRadius: tokens.radii.lg,
      transform: [{ translateY: offscreenY }],
      bottom:
        keyboardHeight > 0 ? Math.max(0, keyboardHeight - insets.bottom) : 0,
    }),
    [
      insets.bottom,
      keyboardHeight,
      offscreenY,
      paddingBottom,
      sheetMaxHeight,
      tokens.colors.surface,
      tokens.radii.lg,
    ]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={styles.root}>
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
              slotStyles?.backdrop,
              backdropAnimatedStyle,
            ]}
          />
        </Pressable>

        <Animated.View
          onLayout={onSheetLayout}
          style={[styles.sheet, sheetChromeStyle, sheetAnimatedStyle]}
        >
          <View
            {...panResponder.panHandlers}
            style={styles.handleArea}
            accessibilityRole="adjustable"
            accessibilityLabel="Drag to dismiss"
          >
            <View
              style={[
                styles.handle,
                { backgroundColor: tokens.colors.border },
                slotStyles?.handle,
              ]}
            />
          </View>
          <View style={{ maxHeight: contentMaxHeight }}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});
