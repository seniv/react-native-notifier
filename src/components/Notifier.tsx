import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
} from 'react';
import type {
  GlobalNotifierInterface,
  NotifierInterface,
  NotifierProps,
  ShowNotificationParams,
} from '../types';
import { NotifierManager } from './NotifierManager';

// we store references to all currently mounted instances of NotifierRoot / NotifierWrapper where omitGlobalMethodsHookup != true
// in order they were mounted, and calling Notifier.showNotification will always show notification from the last mounted instance.
// it allows to render more than one NotifierRoot, for example inside of the modal,
// and still be able to trigger it by the same method without providing ref manually
let refs: MutableRefObject<NotifierInterface>[] = [];

const addRef = (ref: NotifierInterface) => {
  refs.push({
    current: ref,
  });
};

const removeRef = (ref: NotifierInterface | null) => {
  refs = refs.filter((r) => r.current !== ref);
};

/** Responsibilities:
 * - manages refs to display last mounted notification, or broadcast to all
 * - collects default params from props and stores them in the ref to avoid re-renders of the NotifierManager.
 */
const NotifierRootComponent = React.forwardRef<
  NotifierInterface,
  NotifierProps
>((props, ref) => {
  const { omitGlobalMethodsHookup, ...defaultParamsProps } = props;
  const localRef = useRef<NotifierInterface | null>(null);

  // since we don't rely on defaultParamsProps during the render, and access it only during "showNotification" call
  // - this little trick allows us to avoid re-render of NotifierManager component, which triggers ref change, which breaks "refs" array order.
  const defaultParams = useRef<ShowNotificationParams>(defaultParamsProps);
  useEffect(() => {
    defaultParams.current = defaultParamsProps;
  }, [defaultParamsProps]);

  const setRef = useCallback(
    (newRef: NotifierInterface | null) => {
      // set user-specified ref to the notification if it was provided
      if (typeof ref === 'function') {
        ref(newRef);
      } else if (!!ref && 'current' in ref) {
        ref.current = newRef;
      }

      // if newRef is not null and omitGlobalMethodsHookup != true - store ref to current instance
      if (newRef && !omitGlobalMethodsHookup) {
        // add it to the array to access the notification via global Notifier method
        addRef(newRef);
        // store ref locally to be able to remove it from the array when needed
        localRef.current = newRef;
      }
      if (!newRef && localRef.current) {
        // remove the ref when it's changes to null and it was previously set
        removeRef(localRef.current);
      }
    },
    // changes of the "ref" or "omitGlobalMethodsHookup" on the fly (after component was mounted)
    // would change the order of refs
    [ref, omitGlobalMethodsHookup]
  );

  return <NotifierManager ref={setRef} defaultParams={defaultParams} />;
});

const getLastRef = () => {
  const lastRef = refs.findLast((ref) => ref?.current !== null);
  return lastRef ? lastRef.current : null;
};

const broadcast = (fn: (ref: NotifierInterface) => void) => {
  refs.forEach((ref) => {
    if (ref.current) {
      fn(ref.current);
    }
  });
  return undefined;
};

export const Notifier: GlobalNotifierInterface = {
  showNotification: (params) => getLastRef()?.showNotification(params),
  updateNotification: (params) =>
    getLastRef()?.updateNotification(params) ?? false,
  shakeNotification: (resetTimer) =>
    getLastRef()?.shakeNotification(resetTimer),
  isNotificationVisible: () => getLastRef()?.isNotificationVisible() ?? false,
  hideNotification: (onHidden) => getLastRef()?.hideNotification(onHidden),
  clearQueue: (hideDisplayedNotification) =>
    getLastRef()?.clearQueue(hideDisplayedNotification),

  hideById: (id, onHidden) => getLastRef()?.hideById(id, onHidden),
  isVisibleById: (id) => getLastRef()?.isVisibleById(id) ?? false,
  shakeById: (id, resetTimer) => getLastRef()?.shakeById(id, resetTimer),
  updateById: (id, params) => getLastRef()?.updateById(id, params) ?? false,

  broadcast: {
    showNotification: (params) =>
      broadcast((ref) => ref.showNotification(params)),
    updateNotification: (params) =>
      refs.some((ref) => ref.current?.updateNotification(params)),
    shakeNotification: (resetTimer) =>
      broadcast((ref) => ref.shakeNotification(resetTimer)),
    isNotificationVisible: () =>
      refs.some((ref) => ref.current?.isNotificationVisible()),
    hideNotification: (onHidden) =>
      broadcast((ref) => ref.hideNotification(onHidden)),
    clearQueue: (hideDisplayedNotification) =>
      broadcast((ref) => ref.clearQueue(hideDisplayedNotification)),

    hideById: (id, onHidden) => broadcast((ref) => ref.hideById(id, onHidden)),
    isVisibleById: (id) => refs.some((ref) => ref.current?.isVisibleById(id)),
    shakeById: (id, resetTimer) =>
      broadcast((ref) => ref.shakeById(id, resetTimer)),
    updateById: (id, params) =>
      refs.some((ref) => ref.current?.updateById(id, params)),
  },
};

export const NotifierRoot = memo(NotifierRootComponent);
export type NotifierRoot = NotifierInterface;

NotifierRootComponent.displayName = 'ForwardRef(NotifierRoot)';
NotifierRoot.displayName = 'Memo(NotifierRoot)';
