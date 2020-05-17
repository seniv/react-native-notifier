import { NotificationComponentProps } from './components/Notification';
import { AlertComponentProps } from './components/Alert';

export interface ShowParams {
  animationDuration?: number; // 300
  showAnimationDuration?: number; // animationDuration || 300
  hideAnimationDuration?: number; // animationDuration || 300

  easing?: (value: number) => number; // null
  showEasing?: (value: number) => number; // easing || null
  hideEasing?: (value: number) => number; // easing || null

  onStartHiding?: Function; // null
  onHidden?: Function; // null
  onPress?: Function; // null
  hideOnPress?: boolean; // true

  swipePixelsToClose?: number; // 20
  swipeEasing?: (value: number) => number; // null
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

export type EndResult = { finished: boolean };
export type EndCallback = (result: EndResult) => void;

export interface NotifierInterface {
  showNotification: (params: ShowNotificationParams) => void;
  hideNotification: (onHidden?: EndCallback) => void;
}
