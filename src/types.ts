import { ImageSourcePropType } from 'react-native';

export interface ShowParams {
  animationDuration?: number; // 300
  showAnimationDuration?: number; // animationDuration || 300
  hideAnimationDuration?: number; // animationDuration || 300

  easing?: (value: number) => number; // null
  showEasing?: (value: number) => number; // easing || null
  hideEasing?: (value: number) => number; // easing || null

  onHide?: Function; // null
  onPress?: Function; // null
  hideOnPress?: boolean; // true

  swipePixelsToClose?: number; // 20
  swipeEasing?: (value: number) => number; // null
  swipeAnimationDuration?: number; // 200
}

export interface ShowNotification extends ShowParams {
  title?: string; // null
  description?: string; // null
  swipeEnabled?: boolean; // true
  duration?: number; // 3000
  Component?: Function;
  componentProps?: object;
  imageSource?: ImageSourcePropType;
}

export interface StateInterface {
  title?: string;
  description?: string;
  swipeEnabled: boolean;
  Component: Function;
  componentProps: object;
  imageSource?: ImageSourcePropType;
}

export type EndResult = { finished: boolean };
export type EndCallback = (result: EndResult) => void;
