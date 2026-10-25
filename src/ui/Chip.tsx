import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useMicroMotion } from '../animation/micro';
import { useDropdownTheme } from '../theme/DropdownProvider';
import type {
  DropdownItemValue,
  DropdownOption,
  DropdownStyles,
} from '../types';
import { CloseIcon } from './icons';

type Props<T extends DropdownItemValue> = {
  item: DropdownOption<T>;
  onRemove: () => void;
  styles?: DropdownStyles;
};

export function Chip<T extends DropdownItemValue>({
  item,
  onRemove,
  styles: slotStyles,
}: Props<T>) {
  const { tokens } = useDropdownTheme();
  const { chipEntering, chipExiting } = useMicroMotion();
  const pressed = useSharedValue(0);

  const removeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.2 }],
    opacity: 1 - pressed.value * 0.2,
  }));

  return (
    <Animated.View
      entering={chipEntering}
      exiting={chipExiting}
      style={[
        styles.chip,
        {
          backgroundColor: tokens.colors.primaryMuted,
          borderRadius: tokens.radii.pill,
        },
        slotStyles?.chip,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: tokens.colors.primary },
          slotStyles?.chipText,
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
      <Pressable
        onPress={onRemove}
        onPressIn={() => {
          pressed.value = withTiming(1, { duration: 80 });
        }}
        onPressOut={() => {
          pressed.value = withTiming(0, { duration: 120 });
        }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${item.label}`}
      >
        <Animated.View style={removeAnimatedStyle}>
          <CloseIcon color={tokens.colors.primary} size={12} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    maxWidth: 160,
  },
  label: {
    fontSize: 13,
    marginRight: 6,
  },
});
