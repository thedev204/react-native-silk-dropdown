import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useDropdownTheme } from '../theme/DropdownProvider';
import type {
  DropdownItemValue,
  DropdownOption,
  DropdownStyles,
} from '../types';
import { CheckIcon } from './icons';

type Props<T extends DropdownItemValue> = {
  item: DropdownOption<T>;
  selected: boolean;
  onPress: () => void;
  styles?: DropdownStyles;
};

function ItemComponent<T extends DropdownItemValue>({
  item,
  selected,
  onPress,
  styles: slotStyles,
}: Props<T>) {
  const { tokens } = useDropdownTheme();
  const pressed = useSharedValue(0);
  const selectedProgress = useSharedValue(selected ? 1 : 0);

  const primaryMuted = tokens.colors.primaryMuted;
  const surfaceColor = tokens.colors.surface;
  const textColor = tokens.colors.text;
  const primaryColor = tokens.colors.primary;
  const animateTextColor = !slotStyles?.itemTextSelected;

  useEffect(() => {
    // Select snaps in a bit quicker; deselect eases out longer so it doesn't feel abrupt.
    selectedProgress.value = withTiming(selected ? 1 : 0, {
      duration: selected ? 160 : 240,
      easing: selected ? Easing.out(Easing.cubic) : Easing.inOut(Easing.cubic),
    });
  }, [selected, selectedProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const s = selectedProgress.value;
    return {
      transform: [{ scale: 1 - pressed.value * 0.01 }],
      opacity: item.disabled ? 0.45 : 1,
      backgroundColor: interpolateColor(
        s,
        [0, 1],
        [surfaceColor, primaryMuted]
      ),
    };
  });

  const checkStyle = useAnimatedStyle(() => {
    const s = selectedProgress.value;
    return {
      opacity: s,
      transform: [
        { scale: 0.72 + s * 0.28 },
        { rotate: `${(1 - s) * -12}deg` },
      ],
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    if (!animateTextColor) {
      return {};
    }
    return {
      color: interpolateColor(
        selectedProgress.value,
        [0, 1],
        [textColor, primaryColor]
      ),
    };
  });

  return (
    <Pressable
      disabled={item.disabled}
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
      accessibilityRole="menuitem"
      accessibilityState={{ selected, disabled: Boolean(item.disabled) }}
      accessibilityLabel={item.label}
    >
      <Animated.View
        style={[
          styles.row,
          slotStyles?.item,
          selected ? slotStyles?.itemSelected : null,
          animatedStyle,
        ]}
      >
        {item.icon ? <View style={styles.icon}>{item.icon}</View> : null}
        <Animated.Text
          style={[
            styles.label,
            { color: tokens.colors.text },
            slotStyles?.itemText,
            selected ? slotStyles?.itemTextSelected : null,
            labelAnimatedStyle,
          ]}
          numberOfLines={1}
        >
          {item.label}
        </Animated.Text>
        <Animated.View style={[styles.check, checkStyle]}>
          <CheckIcon color={tokens.colors.primary} size={16} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export const Item = memo(ItemComponent) as typeof ItemComponent;

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  check: {
    marginLeft: 8,
  },
});
