import { useEffect, useRef, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { MICRO_PULSE_MS, useMicroMotion } from '../animation/micro';
import { useDropdownTheme } from '../theme/DropdownProvider';
import type {
  DropdownItemValue,
  DropdownOption,
  DropdownStyles,
} from '../types';
import { Chip } from './Chip';
import { AnimatedChevron, CloseIcon } from './icons';

type Props<T extends DropdownItemValue> = {
  open: boolean;
  disabled: boolean;
  placeholder: string;
  label: string;
  multiple: boolean;
  selected: DropdownOption<T> | DropdownOption<T>[] | null;
  clearable: boolean;
  progress: SharedValue<number>;
  styles?: DropdownStyles;
  onPress: () => void;
  onClear: () => void;
  onRemoveChip: (value: T) => void;
  renderChip?: (args: {
    item: DropdownOption<T>;
    onRemove: () => void;
  }) => ReactNode;
  testID?: string;
};

export function Trigger<T extends DropdownItemValue>({
  open,
  disabled,
  placeholder,
  label,
  multiple,
  selected,
  clearable,
  progress,
  styles: slotStyles,
  onPress,
  onClear,
  onRemoveChip,
  renderChip,
  testID,
}: Props<T>) {
  const { tokens } = useDropdownTheme();
  const {
    reduced,
    chipEntering,
    chipExiting,
    labelEntering,
    labelExiting,
    clearEntering,
    clearExiting,
    chipsLayout,
  } = useMicroMotion();
  const pressed = useSharedValue(0);
  const clearPressed = useSharedValue(0);
  const settle = useSharedValue(1);

  const borderColor = tokens.colors.border;
  const primaryColor = tokens.colors.primary;
  const surfaceColor = tokens.colors.surface;
  const mutedSurface = tokens.colors.surfaceMuted;

  const chips = multiple ? (selected as DropdownOption<T>[]) : [];
  const showPlaceholder = !label && chips.length === 0;
  const displayText = showPlaceholder ? placeholder : label;
  const selectionKey = multiple
    ? chips.map((item) => String(item.value)).join('|')
    : label;
  const prevSelectionKey = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevSelectionKey.current;
    prevSelectionKey.current = selectionKey;
    if (reduced || prev === null || prev === selectionKey) {
      return;
    }
    // Very soft settle — barely perceptible so selection doesn't "punch" the field.
    settle.value = withSequence(
      withTiming(0.992, {
        duration: MICRO_PULSE_MS * 0.45,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(1, {
        duration: MICRO_PULSE_MS * 0.55,
        easing: Easing.inOut(Easing.cubic),
      })
    );
  }, [reduced, selectionKey, settle]);

  const triggerAnimatedStyle = useAnimatedStyle(() => {
    const p = Math.min(1, Math.max(0, progress.value));
    return {
      borderColor: interpolateColor(p, [0, 1], [borderColor, primaryColor]),
      backgroundColor: disabled
        ? mutedSurface
        : interpolateColor(p, [0, 1], [surfaceColor, mutedSurface]),
      transform: [{ scale: (1 - pressed.value * 0.008) * settle.value }],
    };
  });

  const clearAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - clearPressed.value * 0.2 }],
    opacity: 1 - clearPressed.value * 0.25,
  }));

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, {
          duration: 120,
          easing: Easing.out(Easing.cubic),
        });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, {
          duration: 180,
          easing: Easing.out(Easing.cubic),
        });
      }}
      accessibilityRole="combobox"
      accessibilityState={{ expanded: open, disabled }}
    >
      <Animated.View
        style={[
          styles.trigger,
          { borderRadius: tokens.radii.md },
          slotStyles?.trigger,
          triggerAnimatedStyle,
        ]}
      >
        <View style={styles.content}>
          {multiple && chips.length > 0 ? (
            <Animated.View style={styles.chips} layout={chipsLayout}>
              {chips.map((item) => {
                const onRemove = () => onRemoveChip(item.value);
                if (renderChip) {
                  return (
                    <Animated.View
                      key={String(item.value)}
                      entering={chipEntering}
                      exiting={chipExiting}
                      layout={chipsLayout}
                    >
                      {renderChip({ item, onRemove })}
                    </Animated.View>
                  );
                }
                return (
                  <Chip
                    key={String(item.value)}
                    item={item}
                    onRemove={onRemove}
                    styles={slotStyles}
                  />
                );
              })}
            </Animated.View>
          ) : (
            <Animated.Text
              key={displayText}
              entering={labelEntering}
              exiting={labelExiting}
              numberOfLines={1}
              style={[
                styles.text,
                {
                  color: showPlaceholder
                    ? tokens.colors.textMuted
                    : tokens.colors.text,
                },
                slotStyles?.triggerText,
              ]}
            >
              {displayText}
            </Animated.Text>
          )}
        </View>

        {clearable && !showPlaceholder ? (
          <Animated.View
            entering={clearEntering}
            exiting={clearExiting}
            style={styles.clear}
          >
            <Pressable
              onPress={onClear}
              onPressIn={() => {
                clearPressed.value = withTiming(1, { duration: 80 });
              }}
              onPressOut={() => {
                clearPressed.value = withTiming(0, { duration: 120 });
              }}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Clear selection"
            >
              <Animated.View style={clearAnimatedStyle}>
                <CloseIcon color={tokens.colors.textMuted} size={14} />
              </Animated.View>
            </Pressable>
          </Animated.View>
        ) : null}

        <AnimatedChevron
          color={tokens.colors.textMuted}
          progress={progress}
          size={16}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 48,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 16,
  },
  clear: {
    marginRight: 10,
    paddingHorizontal: 2,
  },
});
