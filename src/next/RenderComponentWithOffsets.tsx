import { memo, useCallback, useEffect, useState } from 'react';
import type {
  AnimationFunctionParams,
  Notification,
  Offsets,
  ViewWithOffsetsComponent,
} from './types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Animated,
  Keyboard,
  Platform,
  View,
  type KeyboardEventListener,
} from 'react-native';

const useKeyboard = ({
  ignoreKeyboard,
}: Pick<Notification, 'ignoreKeyboard'>) => {
  const [keyboardHeight, setKeyboardHeight] = useState(() =>
    ignoreKeyboard ? 0 : (Keyboard.metrics()?.height ?? 0)
  );

  useEffect(() => {
    if (ignoreKeyboard) return;

    const onShow: KeyboardEventListener = ({ endCoordinates }) =>
      setKeyboardHeight(endCoordinates.height);
    const onHide: KeyboardEventListener = () => setKeyboardHeight(0);

    const listeners = [
      Keyboard.addListener('keyboardDidShow', onShow),
      Keyboard.addListener('keyboardDidHide', onHide),
    ];

    if (Platform.OS === 'ios') {
      listeners.push(
        Keyboard.addListener('keyboardWillShow', onShow),
        Keyboard.addListener('keyboardWillHide', onHide)
      );
    }

    return () => {
      listeners.forEach((listener) => listener.remove());
    };
  }, [ignoreKeyboard]);

  return {
    keyboardHeight,
  };
};

const useOffsets = ({
  additionalOffsets,
  position,
  ignoreSafeAreaInsets,
  ignoreKeyboard,
  additionalKeyboardOffset,
}: Notification): Offsets => {
  const { keyboardHeight } = useKeyboard({ ignoreKeyboard });

  const finalKeyboardOffset =
    keyboardHeight > 0 ? keyboardHeight + additionalKeyboardOffset : 0;

  let safeAreaInsets = useSafeAreaInsets();
  if (ignoreSafeAreaInsets) {
    safeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const top = safeAreaInsets.top + (additionalOffsets?.top ?? 0);
  const right = safeAreaInsets.right + (additionalOffsets?.right ?? 0);
  const bottom =
    Math.max(safeAreaInsets.bottom, finalKeyboardOffset) +
    (additionalOffsets?.bottom ?? 0);
  const left = safeAreaInsets.left + (additionalOffsets?.left ?? 0);

  switch (position) {
    case 'top':
      return { top, right, left, bottom: 0 };
    case 'bottom':
      return { top: 0, right, left, bottom };
    case 'topLeft':
      return { top, right: 0, left, bottom: 0 };
    case 'topRight':
      return { top, right, left: 0, bottom: 0 };
    case 'bottomLeft':
      return { top: 0, right: 0, left, bottom };
    case 'bottomRight':
      return { top: 0, right, left: 0, bottom };
    default:
      return { top: 0, right: 0, left: 0, bottom: 0 };
  }
};

interface RenderComponentWithOffsetsProps {
  notification: Notification;
  hide: (callback?: Animated.EndCallback) => void;
  animationFunctionParams: AnimationFunctionParams;
}
export const RenderComponentWithOffsets = memo(
  ({
    notification,
    animationFunctionParams,
    hide,
  }: RenderComponentWithOffsetsProps) => {
    const offsets = useOffsets(notification);

    const ViewWithOffsets = useCallback<ViewWithOffsetsComponent>(
      ({ style, mode = 'padding', ...props }) => (
        <View
          style={[
            {
              [`${mode}Top`]: offsets.top,
              [`${mode}Right`]: offsets.right,
              [`${mode}Bottom`]: offsets.bottom,
              [`${mode}Left`]: offsets.left,
            },
            style,
          ]}
          {...props}
        />
      ),
      [offsets]
    );

    const { Component } = notification;

    return (
      <Component
        title={notification.title}
        description={notification.description}
        offsets={offsets}
        ViewWithOffsets={ViewWithOffsets}
        hide={hide}
        animationFunctionParams={animationFunctionParams}
        {...notification.componentProps}
      />
    );
  }
);
