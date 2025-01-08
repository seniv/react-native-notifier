import { memo, useCallback, useEffect, useState } from 'react';
import type { Notification, Offsets, ViewWithOffsetsComponent } from './types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Keyboard, Platform, View } from 'react-native';

export const useOffsets = ({
  additionalOffsets,
  position,
  ignoreSafeAreaInsets,
  ignoreKeyboard,
  additionalKeyboardOffset,
}: Notification): Offsets => {
  const [keyboardHeight, setKeyboardHeight] = useState(() =>
    ignoreKeyboard ? 0 : (Keyboard.metrics()?.height ?? 0)
  );
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

  useEffect(() => {
    if (ignoreKeyboard) return;

    const show = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      ({ endCoordinates }) => setKeyboardHeight(endCoordinates.height)
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, [ignoreKeyboard]);

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
}
export const RenderComponentWithOffsets = memo(
  ({ notification }: RenderComponentWithOffsetsProps) => {
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
        {...notification.componentProps}
      />
    );
  }
);
