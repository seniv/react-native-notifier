import { withTiming, type SharedValue } from 'react-native-reanimated';
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_EASING,
  SWIPE_ANIMATION_DURATION,
} from '../constants';
import type { AnimationEndCallback, ShowParams } from '../types';

interface RunAnimationParams {
  animationDriver: SharedValue<number>;
  showParams: React.MutableRefObject<ShowParams | null>;
  callback: AnimationEndCallback;
}

export const runHidingAnimation = ({
  animationDriver,
  showParams,
  callback,
}: RunAnimationParams) => {
  animationDriver.value = withTiming(
    0,
    {
      easing:
        showParams.current?.hideEasing ??
        showParams.current?.easing ??
        DEFAULT_EASING,
      duration:
        showParams.current?.hideAnimationDuration ??
        showParams.current?.animationDuration ??
        DEFAULT_ANIMATION_DURATION,
    },
    callback
  );
};

export const runSwipeOutAnimation = ({
  animationDriver,
  showParams,
  callback,
}: RunAnimationParams) => {
  animationDriver.value = withTiming(
    0,
    {
      easing: showParams.current?.swipeEasing ?? DEFAULT_EASING,
      duration:
        showParams.current?.swipeAnimationDuration ?? SWIPE_ANIMATION_DURATION,
    },
    callback
  );
};

export const runShowingAnimation = ({
  animationDriver,
  showParams,
  callback,
}: RunAnimationParams) => {
  animationDriver.value = withTiming(
    1,
    {
      easing:
        showParams.current?.showEasing ??
        showParams.current?.easing ??
        DEFAULT_EASING,
      duration:
        showParams.current?.showAnimationDuration ??
        showParams.current?.animationDuration ??
        DEFAULT_ANIMATION_DURATION,
    },
    callback
  );
};
