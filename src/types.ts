import { NotificationComponent } from './ui-components/Notification';
import {
  Animated,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import type { ElementType } from 'react';

interface OptionalNativeDriver {
  useNativeDriver?: boolean;
}
interface AnimationTimingConfig {
  method: 'timing';
  config: Omit<Animated.TimingAnimationConfig, 'toValue' | 'useNativeDriver'> &
    OptionalNativeDriver;
}

interface AnimationSpringConfig {
  method: 'spring';
  config: Omit<Animated.SpringAnimationConfig, 'toValue' | 'useNativeDriver'> &
    OptionalNativeDriver;
}
export type AnimationConfig = AnimationTimingConfig | AnimationSpringConfig;

export interface ShakingConfig {
  minValue: number;
  maxValue: number;
  numberOfRepeats: number;
  duration: number;
  vertical?: boolean;
  easing?: Animated.TimingAnimationConfig['easing'];
  useNativeDriver?: boolean;
}

export type Direction = 'top' | 'bottom' | 'left' | 'right';
export type SwipeDirection = Direction | 'horizontal' | 'none';

export type Position =
  | 'top'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

type AnimatedViewProps = React.ComponentProps<
  Animated.AnimatedComponent<typeof View>
>;
export interface AnimationFunctionParams {
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
   * When using New Architecture(Fabric), Correct `componentHeight` should be calculated before UI will be rendered, but sometime it can have few milliseconds delay.
   *
   * If `AnimationFunction` would return styles that somehow changes size of the component (e.g. `scale` property) while `animationState = 0` - height of the component can be calculated incorrectly, so keep it in mind.
   *
   * Initial value is set to `9999` to prevent 2 issues:
   * 1. avoid glitch in case component height calculated few milliseconds after the initial render;
   * 2. avoid crash when you try to divide something by `componentHeight`. **BE CAREFUL!**, it can contain `0` when your component returns empty view or nullable value. So try to avoid dividing by `componentHeight` or avoid situations when your Notification Component can return something that has `height = 0` */
  componentHeight: Animated.Value;
  /** `Animated.Value` that contain width of notification component.
   *
   * When using New Architecture(Fabric), Correct `componentWidth` should be calculated before UI will be rendered, but sometime it can have few milliseconds delay.
   *
   * If `AnimationFunction` would return styles that somehow changes size of the component (e.g. `scale` property) while `animationState = 0` - width of the component can be calculated incorrectly, so keep it in mind.
   *
   * Initial value is set to `9999` to prevent 2 issues:
   * 1. avoid glitch in case component width calculated few milliseconds after the initial render;
   * 2. avoid crash when you try to divide something by `componentWidth`. **BE CAREFUL!**, it can contain `0` when your component returns empty view or nullable value. So try to avoid dividing by `componentWidth` or avoid situations when your Notification Component can return something that has `width = 0` */
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
  /** translateX value that moves the notification when it "shakes" */
  shakingTranslationX: Animated.Value;
  /** translateY value that moves the notification when it "shakes" */
  shakingTranslationY: Animated.Value;
}
export type AnimationFunction = (
  params: AnimationFunctionParams
) => AnimatedViewProps['style'];

export interface Offsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type ViewWithOffsetsComponent = (
  props: { mode?: 'padding' | 'margin' } & ViewProps
) => JSX.Element;

export interface NotifierComponentProps {
  /** `title` param from `showNotification` function */
  title?: string;
  /** `description` param from `showNotification` function */
  description?: string;
  /** offset values is a sum of `safeAriaInsets`(if `ignoreSafeAreaInsets != true`) + keyboard height(for bottom position) + `additionalOffsets` from param */
  offsets: Offsets;
  /**
   * Regular `View` with `offsets` set as `padding` or `margin` depending on the `mode` prop.
   * Use it as container of your Component if you need to automatically handle safe area insets and keyboard height.
   * @param props same as ViewProps
   * @param props.mode `padding` | `margin`
   */
  ViewWithOffsets: ViewWithOffsetsComponent;
  /** A function that hides the notification. Almost like the `Notifier.hideNotification`, but it ensures that it will hide this exact notification. */
  hide: (callback?: Animated.EndCallback) => void;
  /** The same parameter that is passed to the `animationFunction`. Can be useful to animate something inside the component based on the `animationFunctionParams.animationState` */
  animationFunctionParams: AnimationFunctionParams;
}

export type DuplicateBehavior =
  | 'ignore'
  | 'shake'
  | 'shakeAndResetTimer'
  | 'resetTimer'
  | 'proceed';

export type QueueMode = 'immediate' | 'next' | 'standby' | 'reset';

export interface ShowNotificationParams<
  ComponentType extends ElementType = ElementType,
> {
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
    keyof NotifierComponentProps
  >;

  /** What to do if notification __with the same ID(!)__ already shown.
   * - `proceed` - proceed to the `queueMode` step
   * - `ignore` - ignores the call of `showNotification` method
   * - `resetTimer` - reset(prolong) the `duration` timer
   * - `shake` - shake the notification
   * - `shakeAndResetTimer` - shake the notification and reset the `duration` timer
   * @default 'shakeAndResetTimer' */
  duplicateBehavior?: DuplicateBehavior;

  /** Determines the order in which notifications are shown. Read more in the [Queue Mode](https://github.com/seniv/react-native-notifier#queue-mode) section.
   * - `reset` - Clear notification queue and immediately display the new notification.
   * - `standby` - Add notification to the end of the queue.
   * - `next` - Put notification in the first place in the queue. Will be shown right after the current notification disappears.
   * - `immediate` - Similar to next, but also it will hide currently displayed notification.
   * @default 'reset' */
  queueMode?: QueueMode;

  /** A manually provided ID. If supplied, it overrides any generation strategy. If notification with the same ID already shown, result of the `showNotification` will depend on `duplicateBehavior` parameter.
   * @default
   * Math.random()
   * // or hash of the parameters, based on the `idStrategy` parameter
   *  */
  id?: string | number;

  /** Specifies how the ID should be generated if none is manually provided.
   * `hash` - derives an ID from `showNotification` parameters. Multiple calls of the `showNotification` with same parameters will have the same ID.
   * `random` - creates a random ID
   * @default 'hash' */
  idStrategy?: 'hash' | 'random';

  /** Styles Object that will be used in container.
   * @default null
   */
  containerStyle?: AnimatedViewProps['style'];

  /** Function that receives object with various `Animated.Value` and should return Styles that will be used to animate the notification. When set, result of the function will replace default animation. This function will be called only once.
   * @default animationFunctions.slide
   * @example
   * export const fadeInOut: AnimationFunction = ({ animationState }) => {
   *   return {
   *     opacity: animationState,
   *   };
   * };
   * // or use one of presets:
   * animationFunctions.fadeInOut
   */
  animationFunction?: AnimationFunction;

  /** props of Animated Container
   * @default {}
   */
  containerProps?: Omit<AnimatedViewProps, 'style'>;

  /** Config of the function that runs the "showing" animation. `timing` or `spring` method can be used. `useNativeDriver` is `true` by default, but it can be disabled.
   * @default
   * animationConfigs.timing300 // when use NotifierComponents.Alert component
   * animationConfigs.spring // for any other component
   * @example
   * {
   *   method: 'spring',
   *   config: {
   *     friction: 8
   *   },
   * }
   * // or use one of presets:
   * animationConfigs.timing300
   * */
  showAnimationConfig?: AnimationConfig;

  /** Config of the function that runs the "hiding" animation. `timing` or `spring` method can be used. `useNativeDriver` is `true` by default, but it can be disabled.
   * @default animationConfigs.timing300 */
  hideAnimationConfig?: AnimationConfig;

  /** Config of the function that runs animation that hides notification after it was swiped-out. `timing` or `spring` method can be used. `useNativeDriver` is `true` by default, but it can be disabled.
   * @default animationConfigs.timing200 */
  swipeOutAnimationConfig?: AnimationConfig;

  /** Config of the function that runs animation that returns the notification back to "shown" position after it was moved/swiped by the user. `timing` or `spring` method can be used. `useNativeDriver` is `true` by default, but it can be disabled.
   * @default animationConfigs.timing200 */
  resetSwipeAnimationConfig?: AnimationConfig;

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

  /** How many pixels user should move the notification to dismiss it
   * @default 20 */
  swipePixelsToClose?: number;

  /** Time after notification will disappear. Set to `0` to not hide notification automatically
   * @default 3000 */
  duration?: number;

  /** Ignores offsets from `useSafeAreaInsets` hook
   * @default false */
  ignoreSafeAreaInsets?: boolean;

  /** Ignores the keyboard completely. Treats the keyboard as if it is always closed.
   * - `true` - bottom offset will always equal to `safeAreaInsets.bottom + additionalOffsets.bottom`
   *
   * By default `false` on all platforms except the `web`.
   * @default false */
  ignoreKeyboard?: boolean;

  /** Ignores keyboard height offset (when use bottom positions)
   * - `false` - bottom offset will equal to `keyboardHeight + additionalKeyboardOffset` when keyboard is open.
   * - `true` - bottom offset will equal to `additionalKeyboardOffset` when keyboard is open.
   *
   * When keyboard is closed, bottom offset will equal to `safeAreaInsets.bottom + additionalOffsets.bottom`.
   *
   * On __Android__ `true` by default, `false` on other platforms.
   * @default false */
  ignoreKeyboardHeight?: boolean;

  /** Additional bottom offset when keyboard is visible.
   * Works only when `ignoreKeyboard != true`.
   * @default 0 */
  additionalKeyboardOffset?: number;

  /** Offsets in addition to the safeAreaInsets. When keyboard is open and `ignoreKeyboard != true`, `bottom` offset will be ignored and `additionalKeyboardOffset` will be used instead.
   * @default null */
  additionalOffsets?: Partial<Offsets>;

  /** Position of the notification
   * @default 'top'
   */
  position?: Position;

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

  /** Config of the shaking animation. Moves the notification from `minValue` to `maxValue` `numberOfRepeats` times in horizontal or vertical direction. `useNativeDriver` is `true` by default, but it can be disabled.
   * @default
   * shakingConfigs.onlyUp // when use NotifierComponents.Alert component
   * shakingConfigs.horizontal // for any other component
   * @example
   * {
   *   minValue: -5,
   *   maxValue: 5,
   *   vertical: false,
   *   numberOfRepeats: 3,
   *   duration: 50,
   * }
   * */
  shakingConfig?: ShakingConfig;
}

export enum AnimationState {
  Hidden = 0,
  Shown = 1,
}

export type Notification = Omit<
  ShowNotificationParams,
  'queueMode' | 'duplicateBehavior' | 'idStrategy'
> &
  Required<
    Pick<
      ShowNotificationParams,
      | 'Component'
      | 'duration'
      | 'swipePixelsToClose'
      | 'animationFunction'
      | 'position'
      | 'enterFrom'
      | 'exitTo'
      | 'swipeDirection'
      | 'ignoreKeyboard'
      | 'ignoreKeyboardHeight'
      | 'additionalKeyboardOffset'
      | 'showAnimationConfig'
      | 'hideAnimationConfig'
      | 'swipeOutAnimationConfig'
      | 'resetSwipeAnimationConfig'
      | 'id'
      | 'shakingConfig'
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

export type UpdateNotificationParams<
  ComponentType extends ElementType = typeof NotificationComponent,
> = Omit<
  ShowNotificationParams<ComponentType>,
  'queueMode' | 'id' | 'duplicateBehavior'
>;

export interface ShowNotificationReturnType<
  ComponentType extends ElementType = typeof NotificationComponent,
> {
  /** Update this exact notification, if visible - will be updated immediately,
   * if it waits in the queue - it will be updated in the queue and will be displayed with updated parameters.
   *
   * Returns true if notification was updated */
  update(params: UpdateNotificationParams<ComponentType>): boolean;
  /** Hide this exact notification */
  hide(onHidden?: Animated.EndCallback): void;
  /** Shakes this exact notification to attract the user's attention. If pass true as the first parameter, the `duration` timer will reset(prolong) */
  shake(resetTimer?: boolean): void;
  /** Is this exact notification visible */
  isVisible(): boolean;
  /** ID of the notification */
  id: string | number;
}

export interface NotifierInterface {
  /** Show notification with params. Returns `update`, `hide`, `shake`, `isVisible` functions and `id` field. */
  showNotification<
    ComponentType extends ElementType = typeof NotificationComponent,
  >(
    params: ShowNotificationParams<ComponentType>
  ): ShowNotificationReturnType<ComponentType>;

  /** Update currently visible notification. Returns true if notification was updated */
  updateNotification<
    ComponentType extends ElementType = typeof NotificationComponent,
  >(
    params: UpdateNotificationParams<ComponentType>
  ): boolean;

  /** Shakes currently visible notification to attract the user's attention. If pass true as the first parameter, the `duration` timer will reset(prolong) */
  shakeNotification(resetTimer?: boolean): void;

  /** Hide currently visible notification and run callback function when notification completely hidden. */
  hideNotification(onHidden?: Animated.EndCallback): void;

  /** Clear [notifications queue](#queue-mode) and optionally hide currently displayed notification.
   *
   * Might be useful to run after logout, after which queued notifications should not be displayed. */
  clearQueue(hideDisplayedNotification?: boolean): void;
}

export interface GlobalNotifierInterface
  extends Omit<NotifierInterface, 'showNotification' | 'updateNotification'> {
  /** Show notification with params. Returns `update`, `hide`, `shake`, `isVisible` functions and `id` field if at least one Notifier is mounted. */
  showNotification<
    ComponentType extends ElementType = typeof NotificationComponent,
  >(
    params: ShowNotificationParams<ComponentType>
  ): ShowNotificationReturnType<ComponentType> | undefined;

  /** Update currently visible notification. Returns true if notification was updated */
  updateNotification<
    ComponentType extends ElementType = typeof NotificationComponent,
  >(
    params: UpdateNotificationParams<ComponentType>
  ): boolean | undefined;

  /** Broadcasts the command to all currently mounted instances of Notifier, not only to the last one.
   *
   * Useful to hide all currently visible notifications via `Notifier.broadcast.hideNotification()` or clear queue.*/
  broadcast: Omit<GlobalNotifierInterface, 'broadcast'>;
}
