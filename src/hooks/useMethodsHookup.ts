import { useEffect, useImperativeHandle } from 'react';
import { type NotifierInterface } from '../types';

export const Notifier: NotifierInterface = {
  showNotification: () => {},
  hideNotification: () => {},
  clearQueue: () => {},
};

interface UseMethodsHookupParams extends NotifierInterface {
  ref: React.ForwardedRef<NotifierInterface>;
  omitGlobalMethodsHookup?: boolean;
}
export const useMethodsHookup = ({
  ref,
  omitGlobalMethodsHookup,
  showNotification,
  hideNotification,
  clearQueue,
}: UseMethodsHookupParams) => {
  useImperativeHandle(
    ref,
    () => ({
      showNotification,
      hideNotification,
      clearQueue,
    }),
    [showNotification, hideNotification, clearQueue]
  );

  useEffect(() => {
    if (!omitGlobalMethodsHookup) {
      Notifier.showNotification = showNotification;
      Notifier.hideNotification = hideNotification;
      Notifier.clearQueue = clearQueue;
    }
  }, [showNotification, hideNotification, clearQueue, omitGlobalMethodsHookup]);
};
