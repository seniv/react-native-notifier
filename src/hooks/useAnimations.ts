import { useCallback } from 'react';
import { useNotifierInternal } from '../contexts/internal';
import { runOnJS } from 'react-native-reanimated';
import { NotifierState, type AnimationEndCallback } from '../types';
import {
  runHidingAnimation,
  runShowingAnimation,
  runSwipeOutAnimation,
} from '../utils/animations';
import { MAX_VALUE } from '../constants';

interface UseShowAnimationParams {
  setHideTimer: () => void;
}
export const useShowAnimation = ({ setHideTimer }: UseShowAnimationParams) => {
  const { animationDriver, showParams, setNotifierState } =
    useNotifierInternal();

  const onStartShowing = useCallback(() => {
    setNotifierState(NotifierState.IsShowing);
  }, [setNotifierState]);

  const onShowAnimationFinishedJS = useCallback(() => {
    showParams.current?.onShown?.();

    setHideTimer();
    setNotifierState(NotifierState.IsShown);
  }, [setHideTimer, setNotifierState, showParams]);

  const onShowAnimationFinishedWorklet = useCallback<AnimationEndCallback>(
    (finished) => {
      'worklet';
      if (finished) {
        runOnJS(onShowAnimationFinishedJS)();
      }
    },
    [onShowAnimationFinishedJS]
  );

  const startShowingAnimation = useCallback(() => {
    runShowingAnimation({
      animationDriver,
      showParams,
      callback: onShowAnimationFinishedWorklet,
    });

    onStartShowing();
  }, [
    animationDriver,
    showParams,
    onShowAnimationFinishedWorklet,
    onStartShowing,
  ]);

  return { startShowingAnimation };
};

const useHidingAnimationCallbacks = () => {
  const {
    showParams,
    setRenderState,
    resetTimer,
    setNotifierState,
    hiddenTranslateXValue,
    hiddenTranslateYValue,
    translationX,
    translationY,
  } = useNotifierInternal();

  const onStartHiding = useCallback(() => {
    showParams.current?.onStartHiding?.();

    setNotifierState(NotifierState.IsHiding);
    resetTimer();
  }, [showParams, setNotifierState, resetTimer]);

  const onHidingAnimationFinishedJS = useCallback(() => {
    showParams.current?.onHidden?.();

    console.log(Date.now(), 'onHidingAnimationFinished');
    setNotifierState(NotifierState.WaitingForUnmount);
    showParams.current = null;
    setRenderState(null);
  }, [showParams, setNotifierState, setRenderState]);

  const onHidingAnimationFinishedWorklet = useCallback(() => {
    'worklet';
    hiddenTranslateXValue.value = 0;
    hiddenTranslateYValue.value = -MAX_VALUE;
    translationX.value = 0;
    translationY.value = 0;

    runOnJS(onHidingAnimationFinishedJS)();
  }, [
    hiddenTranslateXValue,
    hiddenTranslateYValue,
    translationX,
    translationY,
    onHidingAnimationFinishedJS,
  ]);

  return {
    onStartHiding,
    onHidingAnimationFinishedWorklet,
  };
};

export const useHidingAnimation = () => {
  const { animationDriver, showParams } = useNotifierInternal();
  const { onHidingAnimationFinishedWorklet, onStartHiding } =
    useHidingAnimationCallbacks();

  const startHidingAnimation = useCallback(
    (callback?: AnimationEndCallback) => {
      runHidingAnimation({
        animationDriver,
        showParams,
        callback: (finished) => {
          'worklet';
          onHidingAnimationFinishedWorklet();
          if (typeof callback === 'function') {
            runOnJS(callback)(finished);
          }
        },
      });

      onStartHiding();
    },
    [
      animationDriver,
      onHidingAnimationFinishedWorklet,
      onStartHiding,
      showParams,
    ]
  );

  return { startHidingAnimation };
};

export const useSwipeOutAnimation = () => {
  const { animationDriver, showParams } = useNotifierInternal();
  const { onHidingAnimationFinishedWorklet, onStartHiding } =
    useHidingAnimationCallbacks();

  const startSwipeOutAnimation = useCallback(() => {
    runSwipeOutAnimation({
      animationDriver,
      showParams,
      callback: onHidingAnimationFinishedWorklet,
    });

    onStartHiding();
  }, [
    animationDriver,
    onHidingAnimationFinishedWorklet,
    onStartHiding,
    showParams,
  ]);

  return { startSwipeOutAnimation };
};
