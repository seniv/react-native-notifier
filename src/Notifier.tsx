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
import { notifierLog, notifierLogWorklet } from './utils/logger';

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
        notifierLogWorklet(
          `hiddenTranslateXValue CHANGE: ${prev} -> ${current}`
        )
    );
    useAnimatedReaction(
      () => hiddenTranslateYValue.value,
      (current, prev) =>
        notifierLogWorklet(
          `hiddenTranslateYValue CHANGE: ${prev} -> ${current}`
        )
    );

    const [renderState, setRenderState] = useState<StateInterface | null>(null);

    const setNotifierState = useCallback((newState: NotifierState) => {
      notifierLog(`STATE CHANGE: ${notifierState.current} -> ${newState}`);
      notifierState.current = newState;
    }, []);

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
