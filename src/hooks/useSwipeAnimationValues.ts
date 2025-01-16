import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import type { Notification } from '../types';
import { runResetSwipeAnimation } from '../utils/animations';

export const useSwipeAnimationValues = (notification: Notification) => {
  const swipeTranslationX = useRef(new Animated.Value(0)).current;
  const swipeTranslationY = useRef(new Animated.Value(0)).current;
  const swipeAnimationValues = useRef({
    swipeTranslationX,
    swipeTranslationY,
  }).current;

  const onGestureEvent = useRef(
    Animated.event(
      [
        {
          nativeEvent: {
            translationX: swipeTranslationX,
            translationY: swipeTranslationY,
          },
        },
      ],
      {
        useNativeDriver: true,
      }
    )
  ).current;

  const resetSwipeAnimation = useCallback(() => {
    runResetSwipeAnimation({
      notification,
      swipeTranslationX,
      swipeTranslationY,
    });
  }, [notification, swipeTranslationX, swipeTranslationY]);

  return {
    swipeAnimationValues,
    onGestureEvent,
    resetSwipeAnimation,
  };
};
