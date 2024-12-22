import { Animated } from 'react-native';
import type { AnimationFunction } from '../types';
import { MAX_SWIPE_Y, MIN_SWIPE_Y } from '../constants';

export const getAnimationStyle: AnimationFunction = ({
  animationState,
  componentHeight,
  swipeTranslationY,
}) => {
  const animationTranslateY = Animated.multiply(
    Animated.subtract(animationState, 1),
    componentHeight
  );
  const swipeTranslationYInterpolated = swipeTranslationY.interpolate({
    inputRange: [MIN_SWIPE_Y, MAX_SWIPE_Y],
    outputRange: [MIN_SWIPE_Y, MAX_SWIPE_Y],
    extrapolate: 'clamp',
  });

  return {
    transform: [
      {
        translateY: Animated.add(
          animationTranslateY,
          swipeTranslationYInterpolated
        ),
      },
    ],
  };
};
