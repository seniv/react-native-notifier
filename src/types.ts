import { NotificationComponentProps } from './components/Notification';
import { AlertComponentProps } from './components/Alert';
import { Animated } from 'react-native';

export interface ShowParams {
  animationDuration?: number; // 300
  showAnimationDuration?: number; // animationDuration || 300
  hideAnimationDuration?: number; // animationDuration || 300

  easing?: Animated.TimingAnimationConfig['easing']; // null
  showEasing?: Animated.TimingAnimationConfig['easing']; // easing || null
  hideEasing?: Animated.TimingAnimationConfig['easing']; // easing || null

  onStartHiding?: () => void; // null
  onHidden?: () => void; // null
  onPress?: () => void; // null
  hideOnPress?: boolean; // true

  swipePixelsToClose?: number; // 20
  swipeEasing?: Animated.TimingAnimationConfig['easing']; // null
  swipeAnimationDuration?: number; // 200
}

export type QueueMode = 'immediate' | 'next' | 'standby' | 'reset';

type ComponentProps = NotificationComponentProps | AlertComponentProps | object;

export interface ShowNotificationParams extends ShowParams {
  title?: string; // null
  description?: string; // null
  swipeEnabled?: boolean; // true
  duration?: number; // 3000
  Component?: Function;
  componentProps?: ComponentProps;
  queueMode?: QueueMode;
}

export interface StateInterface {
  title?: string;
  description?: string;
  swipeEnabled: boolean;
  Component: Function;
  componentProps: ComponentProps;
}

export interface NotifierInterface {
  showNotification(params: ShowNotificationParams): void;
  hideNotification(onHidden?: Animated.EndCallback): void;
  clearQueue(hideDisplayedNotification?: boolean): void;
}
