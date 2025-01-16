import type { Animated } from 'react-native';

export const clamp = (value: Animated.Value, min: number, max: number) =>
  value.interpolate({
    inputRange: [min, max],
    outputRange: [min, max],
    extrapolate: 'clamp',
  });
