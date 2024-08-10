import { forwardRef, memo, useCallback } from 'react';
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
import {
  runOnJS,
  useAnimatedReaction,
  type AnimationCallback,
} from 'react-native-reanimated';
import { useMethodsHookup } from './hooks/useMethodsHookup';

const NotifierRootLogicInternal = forwardRef<NotifierInterface, NotifierProps>(
  (
    {
      omitGlobalMethodsHookup,
      useRNScreensOverlay,
      rnScreensOverlayViewStyle,
      ...defaultParams
    },
    ref
  ) => {
    const {
      showParams,
      notifierState,
      hideTimer,
      resetGestures,
      resetHiddenTranslateValues,
      state,
      animationDriver,
      callStack,
      swipeDirection,
      setState,
      resetTimer,
    } = useNotifierInternal();

    const onStartHiding = useCallback(() => {
      showParams.current?.onStartHiding?.();
      notifierState.value = NotifierState.IsHiding;
      resetTimer();
    }, [showParams, notifierState, resetTimer]);

    const onHidingAnimationFinished = useCallback(() => {
      showParams.current?.onHidden?.();

      notifierState.value = NotifierState.WaitingForUnmount;
      showParams.current = null;

      resetGestures();
      resetHiddenTranslateValues();
    }, [showParams, notifierState, resetGestures, resetHiddenTranslateValues]);

    const handleShowAnimationFinished = useCallback(() => {
      notifierState.value = NotifierState.IsShown;
      showParams.current?.onShown?.();
    }, [showParams, notifierState]);

    const hideNotification: NotifierInterface['hideNotification'] = useCallback(
      (callback?: AnimationCallback) => {
        if (
          notifierState.value === NotifierState.IsHiding ||
          notifierState.value === NotifierState.WaitingForUnmount
        ) {
          return;
        }

        runHidingAnimation({
          animationDriver,
          showParams,
          callback: (finished) => {
            onHidingAnimationFinished();
            callback?.(finished);
          },
        });

        onStartHiding();
      },
      [
        notifierState,
        animationDriver,
        showParams,
        onStartHiding,
        onHidingAnimationFinished,
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

        if (notifierState.value !== NotifierState.Hidden) {
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

        setState({
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

        console.log('restParams', restParams);
        console.log('showParams.current', showParams.current);
        console.log(
          showParams.current?.showEasing ?? showParams.current?.easing
        );

        notifierState.value = NotifierState.WaitingForLayout;
      },
      [
        callStack,
        defaultParams,
        hideNotification,
        notifierState,
        setHideTimer,
        setState,
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
      console.log('check callstack', callStack.current);
      const nextNotification = callStack.current.shift();
      if (nextNotification) {
        showNotification(nextNotification);
      }
    }, [callStack, showNotification]);

    const runShowAnimation = useCallback(() => {
      notifierState.value = NotifierState.IsShowing;

      console.log(Date.now(), 'call animation', showParams.current);
      runShowingAnimation({
        animationDriver,
        showParams,
        callback: (finished) => {
          if (finished) {
            runOnJS(handleShowAnimationFinished)();
          }
        },
      });
    }, [
      notifierState,
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
      onHidingAnimationFinished,
      setHideTimer,
    });

    useMethodsHookup({
      ref,
      omitGlobalMethodsHookup,
      showNotification,
      hideNotification,
      clearQueue,
    });

    useAnimatedReaction(
      () => notifierState.value === NotifierState.LayoutCalculated,
      (shouldRunAnimation) => {
        if (shouldRunAnimation) {
          runOnJS(runShowAnimation)();
        }
      }
    );

    useAnimatedReaction(
      () => notifierState.value,
      (currentState, prevState) => {
        if (
          currentState === NotifierState.Hidden &&
          prevState === NotifierState.WaitingForUnmount
        ) {
          runOnJS(checkCallStack)();
        }
      }
    );

    return (
      <NotifierRender
        useRNScreensOverlay={useRNScreensOverlay}
        rnScreensOverlayViewStyle={rnScreensOverlayViewStyle}
        onPress={onPress}
        pan={pan}
        {...state}
      />
    );
  }
);

export const NotifierLogic = memo(NotifierRootLogicInternal);
