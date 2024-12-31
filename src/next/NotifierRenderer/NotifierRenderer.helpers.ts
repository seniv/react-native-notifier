import { Animated } from 'react-native';
import type { AnimationFunction } from '../types';
import { MAX_SWIPE_Y, MIN_SWIPE_Y } from '../constants';

export const defaultAnimationFunction: AnimationFunction = ({
  animationState,
  componentHeight,
  swipeTranslationY,
}) => {
  // interpolate animationState which goes from 0 to 1, to have "-componentHeight" when animationState = 0, and "0" when animationState = 1,
  // in result, notification will slide from top side of the screen when notification appears, and then slide to the top when it disappears
  const animationTranslateY = Animated.multiply(
    Animated.subtract(animationState, 1),
    componentHeight
  );
  // clamp swipeTranslationY value so it doesn't goes higher than 0 (from -9999 to 0)
  // it doesn't allow to drag notification down.
  const swipeTranslationYInterpolated = swipeTranslationY.interpolate({
    inputRange: [MIN_SWIPE_Y, MAX_SWIPE_Y],
    outputRange: [MIN_SWIPE_Y, MAX_SWIPE_Y],
    extrapolate: 'clamp',
  });

  return {
    transform: [
      {
        // translateY to the sum of animationTranslateY and swipeTranslationYInterpolated.
        // which should be between "-componentHeight" and "0"
        translateY: Animated.add(
          animationTranslateY,
          swipeTranslationYInterpolated
        ),
      },
    ],
  };
};
