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
import { getNotificationParameters } from './utils/getNotificationParameters';

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
    (functionParams: ShowNotificationParams) => {
      const { queueMode, ...params } = getNotificationParameters({
        defaultParamsProps,
        functionParams,
      });

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

      setCurrentNotification(params);
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

NotifierManagerComponent.displayName = 'ForwardRef(NotifierManager)';
NotifierManager.displayName = 'Memo(NotifierManager)';
