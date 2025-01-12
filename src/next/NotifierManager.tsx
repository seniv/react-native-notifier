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
  UpdateNotificationParams,
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
 * - export methods "showNotification", "updateNotification", "hideNotification", "clearQueue" via reference
 * - set currentNotification state and use default parameters passed via props
 * - mount NotifierRenderer when call "showNotification", and unmount it when NotifierRenderer calls onHidden.
 */
const NotifierManagerComponent = React.forwardRef<
  NotifierInterface,
  NotifierManagerProps
>(({ defaultParams: defaultParamsProps }, ref) => {
  const currentNotificationId = useRef<string | number | null>(null);
  const callStack = useRef<Array<Notification>>([]);
  const notificationRef = useRef<NotifierRendererMethods>(null);
  const [currentNotification, setCurrentNotification] =
    useState<Notification>();

  const hideNotification = useCallback((callback?: Animated.EndCallback) => {
    if (!currentNotificationId.current) {
      return;
    }

    notificationRef.current?.hideNotification?.(callback);
  }, []);

  const shakeNotification = useCallback((resetTimer?: boolean) => {
    if (!currentNotificationId.current) {
      return;
    }

    notificationRef.current?.shake?.(resetTimer);
  }, []);

  const updateNotification = useCallback(
    (newParams: UpdateNotificationParams<any>) => {
      if (!currentNotificationId.current) {
        return false;
      }

      setCurrentNotification((currentParams) => {
        if (!currentParams) return currentParams;
        return {
          ...currentParams,
          ...newParams,
        };
      });
      return true;
    },
    []
  );

  const getNotificationMethodsForId = useCallback(
    (id: string | number) => ({
      hide: (callback?: Animated.EndCallback) => {
        if (id !== currentNotificationId.current) return;
        return hideNotification(callback);
      },
      update: (params: UpdateNotificationParams<any>) => {
        if (id !== currentNotificationId.current) {
          const callStackItem = callStack.current.find(
            (item) => item.id === id
          );
          if (callStackItem) {
            Object.assign(callStackItem, params);
          }
          return !!callStackItem;
        }
        return updateNotification(params);
      },
      shake: (resetTimer?: boolean) => {
        if (id !== currentNotificationId.current) return;
        return shakeNotification(resetTimer);
      },
      isVisible: () => id === currentNotificationId.current,
    }),
    [hideNotification, shakeNotification, updateNotification]
  );

  const showNotification = useCallback(
    (functionParams: ShowNotificationParams) => {
      const { queueMode, ...params } = getNotificationParameters({
        defaultParamsProps,
        functionParams,
      });

      if (currentNotificationId.current) {
        if (params.id === currentNotificationId.current)
          return getNotificationMethodsForId(params.id);

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
        return getNotificationMethodsForId(params.id);
      }
      currentNotificationId.current = params.id;
      setCurrentNotification(params);

      return getNotificationMethodsForId(params.id);
    },
    [defaultParamsProps, hideNotification, getNotificationMethodsForId]
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
      updateNotification,
      shakeNotification,
      hideNotification,
      clearQueue,
    }),
    [
      showNotification,
      updateNotification,
      shakeNotification,
      hideNotification,
      clearQueue,
    ]
  );

  const onHidden = useCallback(() => setCurrentNotification(undefined), []);

  useEffect(() => {
    if (currentNotification) return;
    currentNotificationId.current = null;

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
