import React, {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { Animated } from 'react-native';
import { Notification as NotificationComponent } from './components';
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_DURATION,
  DEFAULT_SWIPE_ENABLED,
  SWIPE_ANIMATION_DURATION,
  SWIPE_PIXELS_TO_CLOSE,
} from './constants';
import type {
  ShowNotificationParams,
  NotifierInterface,
  Notification,
  QueueMode,
} from './types';
import {
  NotifierRenderer,
  type NotifierRendererMethods,
} from './NotifierRenderer/NotifierRenderer';

interface NotifierManagerProps {
  defaultParams: RefObject<ShowNotificationParams>;
}

/** Component manages queue and exports methods to display/hide notification, and clear the queue
 * Responsibilities:
 * - manages queue
 * - export methods "showNotification", "hideNotification", "clearQueue" via reference
 * - set currentNotification state and use default parameters passed via props
 * - mount NotifierRenderer when call "showNotification", and unmount it when NotifierRenderer calls onHidden.
 */
const NotifierManagerComponent = React.forwardRef<
  NotifierInterface,
  NotifierManagerProps
>(({ defaultParams: defaultParamsProps }, ref) => {
  const isShown = useRef(false);
  const callStack = useRef<Array<ShowNotificationParams>>([]);
  const notificationRef = useRef<NotifierRendererMethods>(null);
  const [currentNotification, setCurrentNotification] =
    useState<Notification>();

  const hideNotification = useCallback((callback?: Animated.EndCallback) => {
    if (!isShown.current) {
      return;
    }

    notificationRef.current?.hideNotification?.(callback);
  }, []);

  const showNotification = useCallback(
    <ComponentType extends React.ElementType = typeof NotificationComponent>(
      functionParams: ShowNotificationParams<ComponentType>
    ) => {
      const params = {
        ...defaultParamsProps.current,
        ...functionParams,
        componentProps: {
          ...defaultParamsProps.current?.componentProps,
          ...functionParams?.componentProps,
        },
      };

      const { queueMode, ...notificationParams } = params;

      if (isShown.current) {
        const queueAction: Record<QueueMode, () => void> = {
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
        queueAction[queueMode ?? 'reset']?.();
        return;
      }

      setCurrentNotification({
        ...notificationParams,
        Component: notificationParams.Component ?? NotificationComponent,
        swipeEnabled: notificationParams.swipeEnabled ?? DEFAULT_SWIPE_ENABLED,
        showAnimationDuration:
          notificationParams?.showAnimationDuration ??
          notificationParams?.animationDuration ??
          DEFAULT_ANIMATION_DURATION,
        hideAnimationDuration:
          notificationParams?.hideAnimationDuration ??
          notificationParams?.animationDuration ??
          DEFAULT_ANIMATION_DURATION,
        duration: notificationParams.duration ?? DEFAULT_DURATION,
        swipePixelsToClose:
          notificationParams?.swipePixelsToClose ?? SWIPE_PIXELS_TO_CLOSE,
        swipeAnimationDuration:
          notificationParams?.swipeAnimationDuration ??
          SWIPE_ANIMATION_DURATION,
        showEasing:
          notificationParams?.showEasing ?? notificationParams?.easing,
        hideEasing:
          notificationParams?.hideEasing ?? notificationParams?.easing,
      });
      isShown.current = true;
    },
    [defaultParamsProps, hideNotification]
  );

  const clearQueue = useCallback(
    (hideDisplayedNotification?: boolean) => {
      callStack.current = [];

      if (hideDisplayedNotification) {
        hideNotification();
      }
    },
    [hideNotification]
  );

  useImperativeHandle(
    ref,
    () => ({
      showNotification,
      hideNotification,
      clearQueue,
    }),
    [showNotification, hideNotification, clearQueue]
  );

  const onHidden = useCallback(() => setCurrentNotification(undefined), []);

  useEffect(() => {
    if (currentNotification) return;
    isShown.current = false;

    const nextNotification = callStack.current.shift();
    if (nextNotification) {
      showNotification(nextNotification);
    }
  }, [showNotification, currentNotification]);

  return currentNotification ? (
    <NotifierRenderer
      notification={currentNotification}
      onHiddenCallback={onHidden}
      ref={notificationRef}
    />
  ) : null;
});

export const NotifierManager = memo(NotifierManagerComponent);
