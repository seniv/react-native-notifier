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
import NotificationComponent from './components/Notification';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { NotifierInternalProvider } from './contexts/internal';
import { NotifierLogic } from './NotifierLogic';

const NotifierRootBase = forwardRef<NotifierInterface, NotifierProps>(
  (props, ref) => {
    const animationDriver = useSharedValue(0);
    const hiddenTranslateXValue = useSharedValue(0);
    const hiddenTranslateYValue = useSharedValue(-MAX_VALUE);
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const componentHeight = useSharedValue(0);
    const componentWidth = useSharedValue(0);

    const notifierState = useSharedValue<NotifierState>(NotifierState.Hidden);
    useAnimatedReaction(
      () => notifierState.value,
      (current, prev) =>
        console.log(Date.now(), `STATE CHANGE: ${prev} -> ${current}`)
    );
    const swipeDirection = useSharedValue<SwipeDirection>('top');

    const showParams = useRef<ShowParams | null>(null);
    const hideTimer = useRef<NodeJS.Timeout>();
    const callStack = useRef<Array<ShowNotificationParams>>([]);

    const [state, setState] = useState<StateInterface>(() => ({
      Component: NotificationComponent,
      componentProps: {},
    }));

    const resetHiddenTranslateValues = useCallback(() => {
      hiddenTranslateXValue.value = 0;
      hiddenTranslateYValue.value = -MAX_VALUE;
    }, [hiddenTranslateXValue, hiddenTranslateYValue]);

    const resetGestures = useCallback(() => {
      translationX.value = 0;
      translationY.value = 0;
    }, [translationX, translationY]);

    const resetTimer = useCallback(() => {
      clearTimeout(hideTimer.current);
    }, [hideTimer]);

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
        state,
        setState,
        resetHiddenTranslateValues,
        resetGestures,
        resetTimer,
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
        state,
        resetHiddenTranslateValues,
        resetGestures,
        resetTimer,
      ]
    );

    useEffect(() => {
      return resetTimer;
    }, [resetTimer]);

    return (
      <NotifierInternalProvider value={internalContextValue}>
        <NotifierLogic {...props} ref={ref} />
      </NotifierInternalProvider>
    );
  }
);

export const NotifierRoot = memo(NotifierRootBase);
