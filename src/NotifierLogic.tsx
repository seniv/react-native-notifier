import { forwardRef, memo, useCallback, useEffect } from 'react';
import { NotifierRender } from './NotifierRender';
import {
  type NotifierProps,
  type NotifierInterface,
  NotifierState,
  type ShowNotificationParams,
  type AnimationEndCallback,
} from './types';
import { useGestures } from './hooks/useGestures';
import { useNotifierInternal } from './contexts/internal';
import { DEFAULT_DURATION } from './constants';
import NotificationComponent from './components/Notification';
import { useMethodsHookup } from './hooks/useMethodsHookup';
import { useLayout } from './hooks/useLayout';
import { useHidingAnimation, useShowAnimation } from './hooks/useAnimations';
import { notifierLog } from './utils/logger';

const NotifierRootLogicInternal = forwardRef<
  NotifierInterface,
  Omit<NotifierProps, 'useRNScreensOverlay' | 'rnScreensOverlayViewStyle'>
>(({ omitGlobalMethodsHookup, ...defaultParams }, ref) => {
  const {
    showParams,
    notifierState,
    hideTimer,
    callStack,
    swipeDirection,
    renderState,
    setRenderState,
    resetTimer,
    setNotifierState,
  } = useNotifierInternal();

  const { startHidingAnimation } = useHidingAnimation();

  const hideNotification: NotifierInterface['hideNotification'] = useCallback(
    (callback?: AnimationEndCallback) => {
      if (
        notifierState.current === NotifierState.IsHiding ||
        notifierState.current === NotifierState.WaitingForUnmount ||
        notifierState.current === NotifierState.Hidden
      ) {
        return;
      }
      notifierLog('hideNotification');

      startHidingAnimation(callback);
    },
    [notifierState, startHidingAnimation]
  );

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

      notifierLog('showNotification', params);

      if (notifierState.current !== NotifierState.Hidden) {
        const queueAction = {
          standby: () => callStack.current.push(params),
          next: () => callStack.current.unshift(params),
          immediate: () => {
            callStack.current.unshift(params);
            hideNotification();
          },
          reset: () => {
            callStack.current = [params];
            hideNotification();
          },
        };
        queueAction[params.queueMode ?? 'reset']();
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
      // TODO: split showParams to "providedCallbacks" or "notificationCallbacks" and "showParams"
      showParams.current = restParams;

      setNotifierState(NotifierState.WaitingForLayout);
    },
    [
      callStack,
      defaultParams,
      hideNotification,
      notifierState,
      setNotifierState,
      setRenderState,
      showParams,
      swipeDirection,
    ]
  );

  const clearQueue: NotifierInterface['clearQueue'] = useCallback(
    (hideDisplayedNotification?: boolean) => {
      notifierLog('clearQueue');

      callStack.current = [];
      if (hideDisplayedNotification) {
        hideNotification();
      }
    },
    [hideNotification, callStack]
  );

  useMethodsHookup({
    ref,
    omitGlobalMethodsHookup,
    showNotification,
    hideNotification,
    clearQueue,
  });

  const onPress = useCallback(() => {
    notifierLog('onPress');

    showParams.current?.onPress?.();
    if (showParams.current?.hideOnPress !== false) {
      hideNotification();
    }
  }, [showParams, hideNotification]);

  const checkCallStack = useCallback(() => {
    notifierLog('checkCallStack', callStack.current);

    const nextNotification = callStack.current.shift();
    if (nextNotification) {
      showNotification(nextNotification);
    }
  }, [callStack, showNotification]);

  useEffect(() => {
    if (
      notifierState.current === NotifierState.WaitingForUnmount &&
      !renderState
    ) {
      setNotifierState(NotifierState.Hidden);
      checkCallStack();
    }
  }, [renderState, notifierState, setNotifierState, checkCallStack]);

  const setHideTimer = useCallback(() => {
    notifierLog('setHideTimer');

    const duration = showParams.current?.duration ?? DEFAULT_DURATION;
    resetTimer();
    if (duration && !isNaN(duration)) {
      hideTimer.current = setTimeout(hideNotification, duration);
    }
  }, [showParams, resetTimer, hideTimer, hideNotification]);

  const { startShowingAnimation } = useShowAnimation({ setHideTimer });
  const { onLayout } = useLayout(startShowingAnimation);
  const { pan } = useGestures({ setHideTimer });

  return <NotifierRender onPress={onPress} pan={pan} onLayout={onLayout} />;
});

export const NotifierLogic = memo(NotifierRootLogicInternal);
