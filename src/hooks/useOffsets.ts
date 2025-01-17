import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Notification, Offsets } from '../types';
import { useKeyboard } from './useKeyboard';

export const useOffsets = ({
  additionalOffsets,
  position,
  ignoreSafeAreaInsets,
  ignoreKeyboard,
  ignoreKeyboardHeight,
  additionalKeyboardOffset,
}: Notification): Offsets => {
  const { keyboardHeight, isKeyboardVisible } = useKeyboard({ ignoreKeyboard });

  const finalKeyboardOffset =
    (ignoreKeyboardHeight ? 0 : keyboardHeight) + additionalKeyboardOffset;

  let safeAreaInsets = useSafeAreaInsets();
  if (ignoreSafeAreaInsets) {
    safeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const top = safeAreaInsets.top + (additionalOffsets?.top ?? 0);
  const right = safeAreaInsets.right + (additionalOffsets?.right ?? 0);
  const bottom = isKeyboardVisible
    ? finalKeyboardOffset
    : safeAreaInsets.bottom + (additionalOffsets?.bottom ?? 0);
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
