import { Animated } from 'react-native';
import type { Notification } from '../types';

interface ResetSwipeAnimationParams {
  swipeTranslationX: Animated.Value;
  swipeTranslationY: Animated.Value;
  notification: Notification;
}
export const resetSwipeAnimation = ({
  swipeTranslationX,
  swipeTranslationY,
  notification,
}: ResetSwipeAnimationParams) => {
  Animated.parallel([
    Animated.timing(swipeTranslationX, {
      toValue: 0,
      easing: notification.swipeEasing,
      duration: notification.swipeAnimationDuration,
      useNativeDriver: true,
    }),
    Animated.timing(swipeTranslationY, {
      toValue: 0,
      easing: notification.swipeEasing,
      duration: notification.swipeAnimationDuration,
      useNativeDriver: true,
    }),
  ]).start();
};
