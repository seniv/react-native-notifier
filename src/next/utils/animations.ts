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
    Animated[notification.resetSwipeAnimationConfig.method](swipeTranslationX, {
      useNativeDriver: true,
      ...notification.resetSwipeAnimationConfig.config,
      toValue: 0,
    }),
    Animated[notification.resetSwipeAnimationConfig.method](swipeTranslationY, {
      useNativeDriver: true,
      ...notification.resetSwipeAnimationConfig.config,
      toValue: 0,
    }),
  ]).start();
};
