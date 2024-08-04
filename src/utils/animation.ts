import { Animated } from 'react-native';

interface AnimateTranslationResetParams {
  translateX: Animated.Value;
  translateY: Animated.Value;
}
export const animateTranslationReset = ({
  translateX,
  translateY,
}: AnimateTranslationResetParams) => {
  Animated.parallel([
    Animated.spring(translateX, {
      toValue: 0,
      friction: 8,
      overshootClamping: true,
      useNativeDriver: true,
    }),
    Animated.spring(translateY, {
      toValue: 0,
      friction: 8,
      overshootClamping: true,
      useNativeDriver: true,
    }),
  ]).start();
};
