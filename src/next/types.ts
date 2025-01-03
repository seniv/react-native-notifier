import { NotificationComponent } from './components/Notification';
import { Animated, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ElementType } from 'react';

export type Direction = 'top' | 'bottom' | 'left' | 'right';
export type SwipeDirection = Direction | 'horizontal' | 'none';

type AnimatedViewProps = React.ComponentProps<
  Animated.AnimatedComponent<typeof View>
>;
export interface AnimationFunctionParam {
  /** value from params, internally used in default animationFunction to limit swipe direction. */
  swipeDirection: SwipeDirection;
  /** `Animated.Value` from 0 to 1, where 0 = notification completely hidden, and 1 = notification fully visible */
  animationState: Animated.Value;
  /** Raw `translationX` value from Pan Gesture Handler, can contain any negative (drag notification left) or positive (drag notification right) values */
  swipeTranslationX: Animated.Value;
  /** Raw `translationY` value from Pan Gesture Handler, can contain any negative (drag notification up) or positive (drag notification down) values */
  swipeTranslationY: Animated.Value;
  /** `Animated.Value` that contain height of notification component.
   *
   * Correct `componentHeight` will be calculated before UI will be rendered, so you can rely on it.
   *
   * If `AnimationFunction` would return styles that somehow changes size of the component (e.g. `scale` property) while `animationState = 0` - height of the component can be calculated incorrectly, so keep it in mind.
   *
   * Initial value is set to `1` to prevent issues when you try to divide something by `componentHeight`. **BE CAREFUL!**, it can contain `0` when your component returns empty view or nullable value. So try to avoid dividing by `componentHeight` or avoid situations when your Notification Component can return something that has `height = 0` */
  componentHeight: Animated.Value;
  /** `Animated.Value` that contain width of notification component.
   *
   * Correct `componentWidth` will be calculated before UI will be rendered, so you can rely on it.
   *
   * If `AnimationFunction` would return styles that somehow changes size of the component (e.g. `scale` property) while `animationState = 0` - width of the component can be calculated incorrectly, so keep it in mind.
   *
   * Initial value is set to `1` to prevent issues when you try to divide something by `componentWidth`. **BE CAREFUL!**, it can contain `0` when your component returns empty view or nullable value. So try to avoid dividing by `componentWidth` or avoid situations when your Notification Component can return something that has `width = 0` */
  componentWidth: Animated.Value;
  /** Value that depends on component width and direction from which notification enters, or to which notification exits.
   * It will dynamically change during notification lifecycle depending on what happens with the notification.
   * When notification enters, it will depend on `enterFrom` and `componentWidth`, when it's hiding, it depends on `exitTo` and `componentWidth`, when it's about to hide by user swipe, it will depend on `swipeDirection`, direction of the swipe(when `swipeDirection: 'horizontal'`) and `componentWidth`.
   *
   * For Example:
   * 1. when notification enters from left (`enterFrom: 'left'`), hiddenTranslateXValue will equal to "-componentWidth".
   * 2. when notification exits to right (`exitTo: 'right'`), hiddenTranslateXValue to componentWidth.
   *
   * Overall, this value is the position where notification should be, when `animationState = 0`
   */
  hiddenTranslateXValue: Animated.Value;
  /** Value that depends on component height and direction from which notification enters, or to which notification exits.
   * It will dynamically change during notification lifecycle depending on what happens with the notification.
   * When notification enters, it will depend on `enterFrom` and `componentHeight`, when it's hiding, it depends on `exitTo` and `componentHeight`, when it's about to hide by user swipe, it will depend on `swipeDirection`, direction of the swipe and `componentHeight`.
   *
   * For Example:
   * 1. when notification enters from top (`enterFrom: 'top'`), hiddenTranslateYValue will equal to "-componentHeight".
   * 2. when notification exits to bottom (`exitTo: 'bottom'`), hiddenTranslateYValue to componentHeight.
   *
   * Overall, this value is the position where notification should be, when `animationState = 0`
   */
  hiddenTranslateYValue: Animated.Value;
}
export type AnimationFunction = (
  param: AnimationFunctionParam
) => AnimatedViewProps['style'];

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

  /** Direction from which notification will appear
   * @default 'top'
   */
  enterFrom?: Direction;

  /** Direction to which notification will slide to hide
   * @default enterFrom || 'top'
   */
  exitTo?: Direction;

  /** Direction in which notification can be swiped out
   * @default enterFrom || 'top'
   */
  swipeDirection?: SwipeDirection;
}

export type QueueMode = 'immediate' | 'next' | 'standby' | 'reset';

export interface ShowNotificationParams<
  ComponentType extends ElementType = ElementType,
> extends ShowParams {
  /** Title of notification. __Passed to `Component`.__
   * @default null */
  title?: string;

  /** Description of notification. __Passed to `Component`.__
   * @default null */
  description?: string;

  /** Component of the notification body. You can use one of the [built-in components](https://github.com/seniv/react-native-notifier#components), or your [custom component](https://github.com/seniv/react-native-notifier#custom-component).
   * @default NotifierComponents.Notification */
  Component?: ComponentType;

  /** Additional props that are passed to `Component`. See all available props of built-in components in the [components section](https://github.com/seniv/react-native-notifier#components)
   * @default {} */
  componentProps?: Omit<
    React.ComponentProps<ComponentType>,
    'title' | 'description'
  >;

  /** Determines the order in which notifications are shown. Read more in the [Queue Mode](https://github.com/seniv/react-native-notifier#queue-mode) section.
   * @default 'reset' */
  queueMode?: QueueMode;

  /** Styles Object that will be used in container.
   * @default null
   */
  containerStyle?: AnimatedViewProps['style'];

  /** Function that receives object with various `Animated.Value` and should return Styles that will be used to animate the notification. When set, result of the function will replace default animation
   * @default null
   */
  animationFunction?: AnimationFunction;

  /** props of Animated Container
   * @default {}
   */
  containerProps?: Omit<AnimatedViewProps, 'style'>;
}

export enum AnimationState {
  Hidden = 0,
  Shown = 1,
}

export type Notification = Omit<
  ShowNotificationParams,
  'queueMode' | 'animationDuration' | 'easing'
> &
  Required<
    Pick<
      ShowNotificationParams,
      | 'Component'
      | 'showAnimationDuration'
      | 'hideAnimationDuration'
      | 'duration'
      | 'swipePixelsToClose'
      | 'swipeAnimationDuration'
      | 'animationFunction'
      | 'enterFrom'
      | 'exitTo'
      | 'swipeDirection'
    >
  >;

export interface NotifierProps extends ShowNotificationParams {
  /** If set to `true`, global `Notifier` methods will not control this component.
   * It's useful in case you have more than one NotifierWrapper or NotifierRoot rendered.
   * If enabled, the only way to display notifications is using refs.
   * @default false */
  omitGlobalMethodsHookup?: boolean;
  /** use FullWindowOverlay component from react-native-screens library
   * If true, Notifier will be rendered above NativeStackNavigation modals and RN Modal on iOS.
   * This Option will work only if react-native-screens library is installed.
   * It's recommended to not change this value on the fly as FullWindowOverlay might not work correctly
   * @platform iOS
   * @default false */
  useRNScreensOverlay?: boolean;

  /** Style that will be used for RN View that is inside of FullWindowOverlay
   * @platform iOS
   * @default null */
  rnScreensOverlayViewStyle?: StyleProp<ViewStyle>;
}

export interface NotifierInterface {
  /** Show notification with params. */
  showNotification<
    ComponentType extends ElementType = typeof NotificationComponent,
  >(
    params: ShowNotificationParams<ComponentType>
  ): void;
  /** Hide notification and run callback function when notification completely hidden. */
  hideNotification(onHidden?: Animated.EndCallback): void;

  /** Clear [notifications queue](#queue-mode) and optionally hide currently displayed notification.
   *
   * Might be useful to run after logout, after which queued notifications should not be displayed. */
  clearQueue(hideDisplayedNotification?: boolean): void;
}

export interface GlobalNotifierInterface extends NotifierInterface {
  /** Broadcasts the command to all currently mounted instances of Notifier, not only to the last one.
   *
   * Useful to hide all currently visible notifications via `Notifier.broadcast.hideNotification()` or clear queue.*/
  broadcast: NotifierInterface;
}
