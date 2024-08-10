import type { SwipeDirection } from '../types';
import { MAX_VALUE } from '../constants';
import { clamp } from 'react-native-reanimated';

type SwipedOutDirection = 'top' | 'bottom' | 'left' | 'right' | 'none';

interface LimitTranslateBySwipeDirectionParams {
  swipeDirection: SwipeDirection;
  translateX: number;
  translateY: number;
}

export const limitTranslateBySwipeDirection = ({
  swipeDirection,
  translateX,
  translateY,
}: LimitTranslateBySwipeDirectionParams) => {
  'worklet';

  switch (swipeDirection) {
    case 'top':
      return {
        translateX: 0,
        translateY: clamp(translateY, -MAX_VALUE, 0),
      };
    case 'bottom':
      return {
        translateX: 0,
        translateY: clamp(translateY, 0, MAX_VALUE),
      };
    case 'horizontal':
      return {
        translateX: translateX,
        translateY: 0,
      };
    case 'left':
      return {
        translateX: clamp(translateX, -MAX_VALUE, 0),
        translateY: 0,
      };
    case 'right':
      return {
        translateX: clamp(translateX, 0, MAX_VALUE),
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
  'worklet';

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
  'worklet';

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
