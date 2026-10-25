import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

type IconProps = {
  color: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

function IconBox({
  size,
  style,
  children,
}: {
  size: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  return (
    <View style={[{ width: size, height: size }, styles.center, style]}>
      {children}
    </View>
  );
}

/** Down-pointing chevron drawn with borders (rotates cleanly). */
export function ChevronIcon({ color, size = 16, style }: IconProps) {
  const arm = Math.max(6, Math.round(size * 0.45));
  const thickness = Math.max(1.5, size * 0.12);

  return (
    <IconBox size={size} style={style}>
      <View
        style={{
          width: arm,
          height: arm,
          borderRightWidth: thickness,
          borderBottomWidth: thickness,
          borderColor: color,
          marginTop: -thickness,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </IconBox>
  );
}

/** Animated wrapper that rotates the chevron with open progress (0→180°). */
export function AnimatedChevron({
  color,
  progress,
  size = 16,
}: {
  color: string;
  progress: SharedValue<number>;
  size?: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const p = Math.min(1, Math.max(0, progress.value));
    return {
      transform: [{ rotate: `${p * 180}deg` }, { scale: 1 + p * 0.06 }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <ChevronIcon color={color} size={size} />
    </Animated.View>
  );
}

/** X / close mark drawn with two rotated bars. */
export function CloseIcon({ color, size = 14, style }: IconProps) {
  const length = Math.max(10, Math.round(size * 0.85));
  const thickness = Math.max(1.5, size * 0.12);

  return (
    <IconBox size={size} style={style}>
      <View
        style={[
          styles.closeBar,
          {
            width: length,
            height: thickness,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
      <View
        style={[
          styles.closeBar,
          {
            width: length,
            height: thickness,
            backgroundColor: color,
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
    </IconBox>
  );
}

/** Checkmark drawn with borders. */
export function CheckIcon({ color, size = 16, style }: IconProps) {
  const thickness = Math.max(1.5, size * 0.12);
  const width = Math.round(size * 0.35);
  const height = Math.round(size * 0.6);

  return (
    <IconBox size={size} style={style}>
      <View
        style={{
          width,
          height,
          borderBottomWidth: thickness,
          borderRightWidth: thickness,
          borderColor: color,
          marginTop: -thickness * 0.5,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </IconBox>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBar: {
    position: 'absolute',
    borderRadius: 1,
  },
});
