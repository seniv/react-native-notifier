import { forwardRef, memo, useCallback, useEffect } from 'react';
import { NotifierRender } from './NotifierRender';
import {
  type NotifierProps,
  type NotifierInterface,
  NotifierState,
  type ShowNotificationParams,
} from './types';
import { useGestures } from './hooks/useGestures';
import { useNotifierInternal } from './contexts/internal';
import { runHidingAnimation, runShowingAnimation } from './utils/animations';
import { DEFAULT_DURATION } from './constants';
import NotificationComponent from './components/Notification';
import { runOnJS, type AnimationCallback } from 'react-native-reanimated';
import { useMethodsHookup } from './hooks/useMethodsHookup';
import { useLayout } from './hooks/useLayout';

const NotifierRootLogicInternal = forwardRef<
  NotifierInterface,
  Omit<NotifierProps, 'useRNScreensOverlay' | 'rnScreensOverlayViewStyle'>
>(({ omitGlobalMethodsHookup, ...defaultParams }, ref) => {
  const {
    showParams,
    notifierState,
    hideTimer,
    resetGestures,
    resetHiddenTranslateValues,
    animationDriver,
    callStack,
    swipeDirection,
    renderState,
    setRenderState,
    resetTimer,
    setNotifierState,
  } = useNotifierInternal();

  const onStartHiding = useCallback(() => {
    showParams.current?.onStartHiding?.();
    setNotifierState(NotifierState.IsHiding);
    resetTimer();
  }, [showParams, setNotifierState, resetTimer]);

  const onHidingAnimationFinished = useCallback(() => {
    console.log(Date.now(), 'onHidingAnimationFinished');
    showParams.current?.onHidden?.();

    setNotifierState(NotifierState.WaitingForUnmount);
    showParams.current = null;
    setRenderState(null);
  }, [showParams, setNotifierState, setRenderState]);
  const onHidingAnimationFinishedWorklet = useCallback(() => {
    'worklet';
    resetGestures();
    resetHiddenTranslateValues();
    runOnJS(onHidingAnimationFinished)();
  }, [resetGestures, resetHiddenTranslateValues, onHidingAnimationFinished]);

  const handleShowAnimationFinished = useCallback(() => {
    setNotifierState(NotifierState.IsShown);
    showParams.current?.onShown?.();
  }, [setNotifierState, showParams]);

  const hideNotification: NotifierInterface['hideNotification'] = useCallback(
    (callback?: AnimationCallback) => {
      if (
        notifierState.current === NotifierState.IsHiding ||
        notifierState.current === NotifierState.WaitingForUnmount ||
        notifierState.current === NotifierState.Hidden
      ) {
        return;
      }

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
      notifierState,
      animationDriver,
      showParams,
      onStartHiding,
      onHidingAnimationFinishedWorklet,
    ]
  );

  const setHideTimer = useCallback(() => {
    const duration = showParams.current?.duration ?? DEFAULT_DURATION;
    resetTimer();
    if (duration && !isNaN(duration)) {
      hideTimer.current = setTimeout(hideNotification, duration);
    }
  }, [showParams, resetTimer, hideTimer, hideNotification]);

  const showNotification: NotifierInterface['showNotification'] = useCallback(
    <ComponentType extends React.ElementType = typeof NotificationComponent>(
      functionParams: ShowNotificationParams<ComponentType>
    ) => {
      const params = {
        ...defaultParams,
        ...functionParams,
        componentProps: {
          ...defaultParams?.componentProps,
          ...functionParams?.componentProps,
        },
      };

      if (notifierState.current !== NotifierState.Hidden) {
        switch (params.queueMode) {
          case 'standby': {
            callStack.current.push(params);
            break;
          }
          case 'next': {
            callStack.current.unshift(params);
            break;
          }
          case 'immediate': {
            callStack.current.unshift(params);
            hideNotification();
            break;
          }
          default: {
            callStack.current = [params];
            hideNotification();
            break;
          }
        }
        return;
      }

      const {
        title,
        description,
        Component = NotificationComponent,
        componentProps,
        translucentStatusBar,
        containerStyle,
        containerProps,
        swipeDirection: swipeDirectionParam = 'top',
        ...restParams
      } = params;

      setRenderState({
        title,
        description,
        Component,
        componentProps,
        translucentStatusBar,
        containerStyle,
        containerProps,
      });

      swipeDirection.value = swipeDirectionParam;
      showParams.current = restParams;

      setHideTimer();

      console.log(Date.now(), 'restParams', restParams);
      console.log(Date.now(), 'showParams.current', showParams.current);

      setNotifierState(NotifierState.WaitingForLayout);
    },
    [
      callStack,
      defaultParams,
      hideNotification,
      notifierState,
      setHideTimer,
      setNotifierState,
      setRenderState,
      showParams,
      swipeDirection,
    ]
  );

  const clearQueue: NotifierInterface['clearQueue'] = useCallback(
    (hideDisplayedNotification?: boolean) => {
      callStack.current = [];

      if (hideDisplayedNotification) {
        hideNotification();
      }
    },
    [hideNotification, callStack]
  );

  const checkCallStack = useCallback(() => {
    console.log(Date.now(), 'check callstack', callStack.current);
    const nextNotification = callStack.current.shift();
    if (nextNotification) {
      showNotification(nextNotification);
    }
  }, [callStack, showNotification]);

  const runShowAnimation = useCallback(() => {
    setNotifierState(NotifierState.IsShowing);

    console.log(Date.now(), 'call animation', showParams.current);
    runShowingAnimation({
      animationDriver,
      showParams,
      callback: (finished) => {
        'worklet';
        if (finished) {
          runOnJS(handleShowAnimationFinished)();
        }
      },
    });
  }, [
    setNotifierState,
    showParams,
    animationDriver,
    handleShowAnimationFinished,
  ]);

  const onPress = useCallback(() => {
    showParams.current?.onPress?.();
    if (showParams.current?.hideOnPress !== false) {
      hideNotification();
    }
  }, [showParams, hideNotification]);

  const { pan } = useGestures({
    onStartHiding,
    onHidingAnimationFinishedWorklet,
    setHideTimer,
  });

  useMethodsHookup({
    ref,
    omitGlobalMethodsHookup,
    showNotification,
    hideNotification,
    clearQueue,
  });

  useEffect(() => {
    if (
      notifierState.current === NotifierState.WaitingForUnmount &&
      !renderState
    ) {
      setNotifierState(NotifierState.Hidden);
      checkCallStack();
    }
  }, [renderState, notifierState, setNotifierState, checkCallStack]);

  const { onLayout } = useLayout(runShowAnimation);

  return <NotifierRender onPress={onPress} pan={pan} onLayout={onLayout} />;
});

export const NotifierLogic = memo(NotifierRootLogicInternal);
