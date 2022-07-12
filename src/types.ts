import NotificationComponent from './components/Notification';
import { Animated, View } from 'react-native';
import { ElementType } from 'react';

type AnimatedViewProps = React.ComponentProps<Animated.AnimatedComponent<typeof View>>;
type ContainerStyleParam =
  | ((translateYAnimatedValue: Animated.Value) => AnimatedViewProps['style'])
  | AnimatedViewProps['style'];

export interface ShowParams {
  /** How fast notification will appear/disappear
   * @default 300 */
  animationDuration?: number;

  /** How fast notification will appear.
   * @default animationDuration || 300 */
  showAnimationDuration?: number;

  /** How fast notification will disappear.
   * @default animationDuration || 300 */
  hideAnimationDuration?: number;

  /** Animation easing. Details: https://reactnative.dev/docs/easing
   * @default null */
  easing?: Animated.TimingAnimationConfig['easing'];

  /** Show Animation easing.
   * @default easing || null */
  showEasing?: Animated.TimingAnimationConfig['easing'];

  /** Hide Animation easing.
   * @default easing || null */
  hideEasing?: Animated.TimingAnimationConfig['easing'];

  /** Function called when entering animation is finished
   * @default null */
  onShown?: () => void;

  /** Function called when notification started hiding
   * @default null */
  onStartHiding?: () => void;

  /** Function called when notification completely hidden
   * @default null */
  onHidden?: () => void;

  /** Function called when user press on notification
   * @default null */
  onPress?: () => void;

  /** Should notification hide when user press on it
   * @default true */
  hideOnPress?: boolean;

  /** How many pixels user should swipe-up notification to dismiss it
   * @default 20 */
  swipePixelsToClose?: number;

  /** Animation easing after user finished swiping
   * @default null */
  swipeEasing?: Animated.TimingAnimationConfig['easing'];

  /** How fast should be animation after user finished swiping
   * @default 200 */
  swipeAnimationDuration?: number;

  /** Time after notification will disappear. Set to `0` to not hide notification automatically
   * @default 3000 */
  duration?: number;
}

export type QueueMode = 'immediate' | 'next' | 'standby' | 'reset';

export interface ShowNotificationParams<ComponentType extends ElementType = ElementType>
  extends ShowParams {
  /** Title of notification. __Passed to `Component`.__
   * @default null */
  title?: string;

  /** Description of notification. __Passed to `Component`.__
   * @default null */
  description?: string;

  /** Can notification be hidden by swiping it out
   * @default true */
  swipeEnabled?: boolean;

  /** Component of the notification body. You can use one of the [built-in components](https://github.com/seniv/react-native-notifier#components), or your [custom component](https://github.com/seniv/react-native-notifier#custom-component).
   * @default NotifierComponents.Notification */
  Component?: ComponentType;

  /** Additional props that are passed to `Component`. See all available props of built-in components in the [components section](https://github.com/seniv/react-native-notifier#components)
   * @default {} */
  componentProps?: Omit<React.ComponentProps<ComponentType>, 'title' | 'description'>;

  /** Determines the order in which notifications are shown. Read more in the [Queue Mode](https://github.com/seniv/react-native-notifier#queue-mode) section.
   * @default 'reset' */
  queueMode?: QueueMode;

  /** Add top padding that equals to `StatusBar.currentHeight` to correctly display notification when status bar is translucent. Android Only.
   * @platform Android
   * @default false
   */
  translucentStatusBar?: boolean;

  /** Styles Object or A function that will receive `translateY: Animated.Value` as first parameter and should return Styles that will be used in container. Using this parameter it is possible to create your own animations of the notification. BE CAREFUL!! when set `transform` style it will override default animation.
   * @default null
   */
  containerStyle?: ContainerStyleParam;

  /** props of Animated Container
   * @default {}
   */
  containerProps?: Omit<AnimatedViewProps, 'style'>;
}

export interface StateInterface {
  title?: string;
  description?: string;
  swipeEnabled: boolean;
  Component: ElementType;
  componentProps: Record<string, any>;
  translucentStatusBar?: boolean;
  containerStyle?: ContainerStyleParam;
  containerProps?: Omit<AnimatedViewProps, 'style'>;
}

export interface NotifierInterface {
  showNotification<ComponentType extends ElementType = typeof NotificationComponent>(
    params: ShowNotificationParams<ComponentType>
  ): void;
  hideNotification(onHidden?: Animated.EndCallback): void;
  clearQueue(hideDisplayedNotification?: boolean): void;
}
