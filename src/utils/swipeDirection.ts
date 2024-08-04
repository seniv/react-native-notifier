import { Animated } from 'react-native';
import type { SwipeDirection } from '../types';
import { MAX_VALUE } from '../constants';

type SwipedOutDirection = 'top' | 'bottom' | 'left' | 'right' | 'none';

interface LimitTranslateBySwipeDirectionParams {
  swipeDirection: SwipeDirection;
  translateX: Animated.Value;
  translateY: Animated.Value;
}

export const limitTranslateBySwipeDirection = ({
  swipeDirection,
  translateX,
  translateY,
}: LimitTranslateBySwipeDirectionParams) => {
  switch (swipeDirection) {
    case 'top':
      return {
        translateX: 0,
        translateY: translateY.interpolate({
          inputRange: [-MAX_VALUE, 0],
          outputRange: [-MAX_VALUE, 0],
          extrapolate: 'clamp',
        }),
      };
    case 'bottom':
      return {
        translateX: 0,
        translateY: translateY.interpolate({
          inputRange: [0, MAX_VALUE],
          outputRange: [0, MAX_VALUE],
          extrapolate: 'clamp',
        }),
      };
    case 'horizontal':
      return {
        translateX: translateX,
        translateY: 0,
      };
    case 'left':
      return {
        translateX: translateX.interpolate({
          inputRange: [-MAX_VALUE, 0],
          outputRange: [-MAX_VALUE, 0],
          extrapolate: 'clamp',
        }),
        translateY: 0,
      };
    case 'right':
      return {
        translateX: translateX.interpolate({
          inputRange: [0, MAX_VALUE],
          outputRange: [0, MAX_VALUE],
          extrapolate: 'clamp',
        }),
        translateY: 0,
      };
    default:
      return {
        translateX: 0,
        translateY: 0,
      };
  }
};

interface GetSwipedOutDirectionParams {
  swipeDirection: SwipeDirection;
  swipePixelsToClose: number;
  translationX: number;
  translationY: number;
}

export const getSwipedOutDirection = ({
  swipeDirection,
  swipePixelsToClose,
  translationX,
  translationY,
}: GetSwipedOutDirectionParams): SwipedOutDirection => {
  switch (swipeDirection) {
    case 'top':
      return translationY < -swipePixelsToClose ? 'top' : 'none';
    case 'bottom':
      return translationY > swipePixelsToClose ? 'bottom' : 'none';
    case 'horizontal': {
      if (translationX < -swipePixelsToClose) {
        return 'left';
      } else if (translationX > swipePixelsToClose) {
        return 'right';
      }
      return 'none';
    }
    case 'left':
      return translationX < -swipePixelsToClose ? 'left' : 'none';
    case 'right':
      return translationX > swipePixelsToClose ? 'right' : 'none';
    default:
      return 'none';
  }
};

interface GetHiddenTranslateValuesParams {
  swipedOutDirection: Exclude<SwipedOutDirection, 'none'>;
  componentHeight: number;
  componentWidth: number;
}

export const getHiddenTranslateValues = ({
  swipedOutDirection,
  componentHeight,
  componentWidth,
}: GetHiddenTranslateValuesParams) => {
  switch (swipedOutDirection) {
    case 'top':
      return {
        hiddenTranslateYValue: -componentHeight,
        hiddenTranslateXValue: 0,
      };
    case 'bottom':
      return {
        hiddenTranslateYValue: componentHeight,
        hiddenTranslateXValue: 0,
      };
    case 'left':
      return {
        hiddenTranslateYValue: 0,
        hiddenTranslateXValue: -componentWidth,
      };
    case 'right':
      return {
        hiddenTranslateYValue: 0,
        hiddenTranslateXValue: componentWidth,
      };
  }
};

interface GetFinalTranslateValueParams {
  swipeDirection: SwipeDirection;
  animationDriver: Animated.Value;
  translateX: Animated.Value;
  translateY: Animated.Value;
  hiddenTranslateXValue: Animated.Value;
  hiddenTranslateYValue: Animated.Value;
}

export interface FinalTranslateValue {
  finalTranslateX: Animated.AnimatedAddition<number>;
  finalTranslateY: Animated.AnimatedAddition<number>;
}

export const getFinalTranslateValue = ({
  swipeDirection,
  animationDriver,
  translateX,
  translateY,
  hiddenTranslateXValue,
  hiddenTranslateYValue,
}: GetFinalTranslateValueParams): FinalTranslateValue => {
  const { translateX: swipeTranslateX, translateY: swipeTranslateY } =
    limitTranslateBySwipeDirection({
      swipeDirection,
      translateX: translateX,
      translateY: translateY,
    });

  const finalTranslateX = Animated.add(
    swipeTranslateX,
    Animated.multiply(
      Animated.subtract(1, animationDriver),
      hiddenTranslateXValue
    )
  );

  const finalTranslateY = Animated.add(
    swipeTranslateY,
    Animated.multiply(
      Animated.subtract(1, animationDriver),
      hiddenTranslateYValue
    )
  );

  return {
    finalTranslateX,
    finalTranslateY,
  };
};
