import { Animated } from 'react-native';
import type { AnimationFunction } from '../types';
import { limitTranslateBySwipeDirection } from '../utils/animationDirection';

export const slide: AnimationFunction = ({
  swipeDirection,
  animationState,
  hiddenTranslateXValue,
  hiddenTranslateYValue,
  swipeTranslationX,
  swipeTranslationY,
}) => {
  // invert state to make it easier to multiply later
  const invertedState = Animated.subtract(1, animationState);

  // multiply invertedState by the hiddenTranslate* values, so when animationState = 1,
  // both animationTranslate* would have 0, and when animationState = 0, both animationTranslate* would equal hiddenTranslate*Value
  const animationTranslateX = Animated.multiply(
    invertedState,
    hiddenTranslateXValue
  );
  const animationTranslateY = Animated.multiply(
    invertedState,
    hiddenTranslateYValue
  );

  // clamp swipeTranslation values depending on the swipeDirection parameter
  const { translateX, translateY } = limitTranslateBySwipeDirection({
    swipeDirection,
    translateX: swipeTranslationX,
    translateY: swipeTranslationY,
  });

  return {
    transform: [
      {
        // add value base on animationState to the clamped swipe translation
        translateX: Animated.add(animationTranslateX, translateX),
      },
      {
        // add value base on animationState to the clamped swipe translation
        translateY: Animated.add(animationTranslateY, translateY),
      },
    ],
  };
};

export const fadeInOut: AnimationFunction = ({ animationState }) => {
  return {
    opacity: animationState,
  };
};
