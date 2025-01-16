import { useEffect, useState } from 'react';
import { Keyboard, Platform, type KeyboardEventListener } from 'react-native';
import type { Notification } from '../types';

export const useKeyboard = ({
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
