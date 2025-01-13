import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import type { Notification } from '../types';

export const useShaking = ({ shakingConfig }: Notification) => {
  const shakingTranslationX = useRef(new Animated.Value(0)).current;
  const shakingTranslationY = useRef(new Animated.Value(0)).current;
  const shakingAnimationValues = useRef({
    shakingTranslationX,
    shakingTranslationY,
  }).current;

  const shake = useCallback(() => {
    const { minValue, maxValue, vertical, numberOfRepeats, ...config } =
      shakingConfig;
    const value = vertical ? shakingTranslationY : shakingTranslationX;

    Animated.sequence([
      ...Array.from({ length: numberOfRepeats }, () => [
        Animated.timing(value, {
          toValue: minValue,
          useNativeDriver: true,
          ...config,
        }),
        Animated.timing(value, {
          toValue: maxValue,
          useNativeDriver: true,
          ...config,
        }),
      ]).flat(),
      Animated.timing(value, {
        toValue: 0,
        useNativeDriver: true,
        ...config,
      }),
    ]).start();
  }, [shakingConfig, shakingTranslationX, shakingTranslationY]);

  return {
    shake,
    shakingAnimationValues,
  };
};
