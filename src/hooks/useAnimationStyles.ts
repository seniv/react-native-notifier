import { useNotifierInternal } from '../contexts/internal';
import { interpolate, useAnimatedStyle } from 'react-native-reanimated';

export const useAnimationStyles = () => {
  const {
    animationDriver,
    hiddenTranslateXValue,
    hiddenTranslateYValue,
    translationX,
    translationY,
  } = useNotifierInternal();

  return useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX:
            translationX.value +
            interpolate(
              animationDriver.value,
              [0, 1],
              [hiddenTranslateXValue.value, 0]
            ),
        },
        {
          translateY:
            translationY.value +
            interpolate(
              animationDriver.value,
              [0, 1],
              [hiddenTranslateYValue.value, 0]
            ),
        },
      ],
    };
  });
};
