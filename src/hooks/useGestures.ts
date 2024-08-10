import {
  Gesture,
  type GestureStateChangeEvent,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { SWIPE_PIXELS_TO_CLOSE } from '../constants';
import {
  getHiddenTranslateValues,
  getSwipedOutDirection,
  limitTranslateBySwipeDirection,
} from '../utils/swipeDirection';
import { useCallback, useMemo } from 'react';
import { runOnJS, withSpring } from 'react-native-reanimated';
import { useNotifierInternal } from '../contexts/internal';
import { runSwipeOutAnimation } from '../utils/animations';

interface UseGesturesParams {
  onHidingAnimationFinished: () => void;
  onStartHiding: () => void;
  setHideTimer: () => void;
}
export const useGestures = ({
  onHidingAnimationFinished,
  onStartHiding,
  setHideTimer,
}: UseGesturesParams) => {
  const {
    animationDriver,
    componentHeight,
    componentWidth,
    hiddenTranslateXValue,
    hiddenTranslateYValue,
    translationX,
    translationY,
    showParams,
    swipeDirection,
    resetTimer,
  } = useNotifierInternal();

  const onEnd = useCallback(
    (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      setHideTimer();

      const swipePixelsToClose =
        showParams.current?.swipePixelsToClose ?? SWIPE_PIXELS_TO_CLOSE;

      const swipedOutDirection = getSwipedOutDirection({
        swipeDirection: swipeDirection.value,
        swipePixelsToClose,
        translationX: event.translationX,
        translationY: event.translationY,
      });

      if (swipedOutDirection === 'none') {
        translationX.value = withSpring(0, { overshootClamping: true });
        translationY.value = withSpring(0, { overshootClamping: true });
        return;
      }

      const {
        hiddenTranslateXValue: newHiddenTranslateXValue,
        hiddenTranslateYValue: newHiddenTranslateYValue,
      } = getHiddenTranslateValues({
        swipedOutDirection,
        componentHeight: componentHeight.value,
        componentWidth: componentWidth.value,
      });

      hiddenTranslateXValue.value = newHiddenTranslateXValue;
      hiddenTranslateYValue.value = newHiddenTranslateYValue;

      runSwipeOutAnimation({
        animationDriver,
        showParams,
        callback: onHidingAnimationFinished,
      });

      onStartHiding();
    },
    [
      animationDriver,
      componentHeight,
      componentWidth,
      hiddenTranslateXValue,
      hiddenTranslateYValue,
      onHidingAnimationFinished,
      onStartHiding,
      setHideTimer,
      showParams,
      swipeDirection,
      translationX,
      translationY,
    ]
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(1)
        .onBegin(() => {
          runOnJS(resetTimer)();
        })
        .onEnd((event) => {
          runOnJS(onEnd)(event);
        })
        .onUpdate((event) => {
          const { translateX, translateY } = limitTranslateBySwipeDirection({
            swipeDirection: swipeDirection.value,
            translateX: event.translationX,
            translateY: event.translationY,
          });

          translationX.value = translateX;
          translationY.value = translateY;
        }),
    [onEnd, swipeDirection, translationX, translationY, resetTimer]
  );

  return {
    pan,
  };
};
