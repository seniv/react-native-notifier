import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type NotifierProps,
  type StateInterface,
  type ShowParams,
  type NotifierInterface,
  type ShowNotificationParams,
  type SwipeDirection,
  NotifierState,
} from './types';
import { MAX_VALUE } from './constants';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { NotifierInternalProvider } from './contexts/internal';
import { NotifierLogic } from './NotifierLogic';
import { FullWindowOverlay } from './components/FullWindowOverlay';

const NotifierRootBase = forwardRef<NotifierInterface, NotifierProps>(
  ({ useRNScreensOverlay, rnScreensOverlayViewStyle, ...props }, ref) => {
    const animationDriver = useSharedValue(0);
    const hiddenTranslateXValue = useSharedValue(0);
    const hiddenTranslateYValue = useSharedValue(-MAX_VALUE);
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const componentHeight = useSharedValue(0);
    const componentWidth = useSharedValue(0);
    const swipeDirection = useSharedValue<SwipeDirection>('top');

    const notifierState = useRef<NotifierState>(NotifierState.Hidden);
    const showParams = useRef<ShowParams | null>(null);
    const hideTimer = useRef<NodeJS.Timeout>();
    const callStack = useRef<Array<ShowNotificationParams>>([]);

    useAnimatedReaction(
      () => hiddenTranslateXValue.value,
      (current, prev) =>
        console.log(
          Date.now(),
          `hiddenTranslateXValue CHANGE: ${prev} -> ${current}`
        )
    );
    useAnimatedReaction(
      () => hiddenTranslateYValue.value,
      (current, prev) =>
        console.log(
          Date.now(),
          `hiddenTranslateYValue CHANGE: ${prev} -> ${current}`
        )
    );

    const [renderState, setRenderState] = useState<StateInterface | null>(null);

    const setNotifierState = useCallback((newState: NotifierState) => {
      console.log(
        Date.now(),
        `STATE CHANGE: ${notifierState.current} -> ${newState}`
      );
      notifierState.current = newState;
    }, []);

    const resetHiddenTranslateValues = useCallback(() => {
      'worklet';
      hiddenTranslateXValue.value = 0;
      hiddenTranslateYValue.value = -MAX_VALUE;
    }, [hiddenTranslateXValue, hiddenTranslateYValue]);

    const resetGestures = useCallback(() => {
      'worklet';
      translationX.value = 0;
      translationY.value = 0;
    }, [translationX, translationY]);

    const resetTimer = useCallback(() => {
      clearTimeout(hideTimer.current);
    }, []);

    const internalContextValue = useMemo(
      () => ({
        animationDriver,
        hiddenTranslateXValue,
        hiddenTranslateYValue,
        translationX,
        translationY,
        notifierState,
        componentHeight,
        componentWidth,
        showParams,
        hideTimer,
        callStack,
        swipeDirection,
        renderState,
        setRenderState,
        resetHiddenTranslateValues,
        resetGestures,
        resetTimer,
        setNotifierState,
      }),
      [
        animationDriver,
        hiddenTranslateXValue,
        hiddenTranslateYValue,
        translationX,
        translationY,
        notifierState,
        componentHeight,
        componentWidth,
        swipeDirection,
        renderState,
        resetHiddenTranslateValues,
        resetGestures,
        resetTimer,
        setNotifierState,
      ]
    );

    useEffect(() => {
      return resetTimer;
    }, [resetTimer]);

    return (
      <FullWindowOverlay
        useOverlay={useRNScreensOverlay}
        viewStyle={rnScreensOverlayViewStyle}
      >
        <NotifierInternalProvider value={internalContextValue}>
          <NotifierLogic {...props} ref={ref} />
        </NotifierInternalProvider>
      </FullWindowOverlay>
    );
  }
);

export const NotifierRoot = memo(NotifierRootBase);
