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
  ShowNotificationReturnType,
} from '../types';
import {
  NotifierRenderer,
  type NotifierRendererMethods,
} from './NotifierRenderer';
import { getNotificationParameters } from '../utils/getNotificationParameters';

interface NotifierManagerProps {
  defaultParams: RefObject<ShowNotificationParams>;
}

/** Component manages queue and exports methods to display/hide notification, and clear the queue
 * Responsibilities:
 * - manages queue and handle duplicates
 * - export methods "showNotification", "updateNotification", "shakeNotification", "hideNotification", "clearQueue" via reference
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
    if (!currentNotificationId.current) return;

    notificationRef.current?.hideNotification?.(callback);
  }, []);

  const resetNotificationTimer = useCallback(() => {
    if (!currentNotificationId.current) return;

    notificationRef.current?.resetTimer?.();
  }, []);

  const shakeNotification = useCallback(
    (resetTimerParam?: boolean) => {
      if (!currentNotificationId.current) return;

      if (resetTimerParam) resetNotificationTimer();
      notificationRef.current?.shake?.();
    },
    [resetNotificationTimer]
  );

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
    (id: string | number): ShowNotificationReturnType<any> => ({
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
      shake: (resetTimerParam?: boolean) => {
        if (id !== currentNotificationId.current) return;
        return shakeNotification(resetTimerParam);
      },
      isVisible: () => id === currentNotificationId.current,
      id,
    }),
    [hideNotification, shakeNotification, updateNotification]
  );

  const showNotification = useCallback(
    (functionParams: ShowNotificationParams) => {
      const { queueMode, duplicateBehavior, ...params } =
        getNotificationParameters({
          defaultParamsProps,
          functionParams,
        });

      if (currentNotificationId.current) {
        if (
          params.id === currentNotificationId.current &&
          duplicateBehavior !== 'proceed'
        ) {
          switch (duplicateBehavior) {
            case 'shake': {
              shakeNotification();
              break;
            }
            case 'shakeAndResetTimer': {
              shakeNotification(true);
              break;
            }
            case 'resetTimer':
              resetNotificationTimer();
          }

          return getNotificationMethodsForId(params.id);
        }

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
        queueAction[queueMode]?.();
        return getNotificationMethodsForId(params.id);
      }
      currentNotificationId.current = params.id;
      setCurrentNotification(params);

      return getNotificationMethodsForId(params.id);
    },
    [
      defaultParamsProps,
      getNotificationMethodsForId,
      resetNotificationTimer,
      shakeNotification,
      hideNotification,
    ]
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

  // It is important that the methods below never change their reference
  // because it will break the order of refs to the Component
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
