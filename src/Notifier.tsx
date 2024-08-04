import React from 'react';
import { Animated, View, type LayoutChangeEvent, Platform } from 'react-native';
import {
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
  type PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import styles from './Notifier.styles';
import { Notification as NotificationComponent } from './components';
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_DURATION,
  SWIPE_ANIMATION_DURATION,
  SWIPE_PIXELS_TO_CLOSE,
  DEFAULT_SWIPE_ENABLED,
  MAX_VALUE,
  SAFETY_MARGIN_TO_COMPONENT_SIZE,
} from './constants';
import type {
  ShowParams,
  ShowNotificationParams,
  StateInterface,
  NotifierInterface,
  NotifierProps,
} from './types';
import { FullWindowOverlay } from './components/FullWindowOverlay';
import {
  getFinalTranslateValue,
  getHiddenTranslateValues,
  getSwipedOutDirection,
  type FinalTranslateValue,
} from './utils/swipeDirection';
import { animateTranslationReset } from './utils/animation';

export const Notifier: NotifierInterface = {
  showNotification: () => {},
  hideNotification: () => {},
  clearQueue: () => {},
};

export class NotifierRoot extends React.PureComponent<
  NotifierProps,
  StateInterface
> {
  private isShown: boolean;
  private isHiding: boolean;
  private hideTimer: any;
  private showParams: ShowParams | null;
  private callStack: Array<ShowNotificationParams>;
  private componentHeight: number;
  private componentWidth: number;
  private readonly animationDriver: Animated.Value;
  private readonly translateY: Animated.Value;
  private readonly translateX: Animated.Value;
  private readonly hiddenTranslateYValue: Animated.Value;
  private readonly hiddenTranslateXValue: Animated.Value;
  private readonly onGestureEvent: (...args: any[]) => void;

  constructor(props: NotifierProps) {
    super(props);

    this.isShown = false;
    this.isHiding = false;
    this.hideTimer = null;
    this.showParams = null;
    this.callStack = [];

    this.componentHeight = 0;
    this.componentWidth = 0;
    this.animationDriver = new Animated.Value(0);
    this.translateY = new Animated.Value(0);
    this.translateX = new Animated.Value(0);
    this.hiddenTranslateYValue = new Animated.Value(-MAX_VALUE);
    this.hiddenTranslateXValue = new Animated.Value(0);

    this.state = {
      Component: NotificationComponent,
      swipeEnabled: DEFAULT_SWIPE_ENABLED,
      componentProps: {},
      swipeDirection: 'top',
      ...getFinalTranslateValue({
        swipeDirection: 'top',
        animationDriver: this.animationDriver,
        hiddenTranslateXValue: this.hiddenTranslateXValue,
        hiddenTranslateYValue: this.hiddenTranslateYValue,
        translateX: this.translateX,
        translateY: this.translateY,
      }),
    };

    this.onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationY: this.translateY,
            translationX: this.translateX,
          },
        },
      ],
      { useNativeDriver: true }
    );

    this.onPress = this.onPress.bind(this);
    this.onHandlerStateChange = this.onHandlerStateChange.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.showNotification = this.showNotification.bind(this);
    this.hideNotification = this.hideNotification.bind(this);
    this.clearQueue = this.clearQueue.bind(this);

    if (!props.omitGlobalMethodsHookup) {
      Notifier.showNotification = this.showNotification;
      Notifier.hideNotification = this.hideNotification;
      Notifier.clearQueue = this.clearQueue;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimer);
  }

  public hideNotification(callback?: Animated.EndCallback) {
    if (!this.isShown || this.isHiding) {
      return;
    }

    Animated.timing(this.animationDriver, {
      toValue: 0,
      easing: this.showParams?.hideEasing ?? this.showParams?.easing,
      duration:
        this.showParams?.hideAnimationDuration ??
        this.showParams?.animationDuration ??
        DEFAULT_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start((result) => {
      this.onHidden();
      callback?.(result);
    });

    this.onStartHiding();
  }

  public showNotification<
    ComponentType extends React.ElementType = typeof NotificationComponent,
  >(functionParams: ShowNotificationParams<ComponentType>) {
    const {
      // Remove "omitGlobalMethodsHookup" prop as it is only utilized within the constructor and is redundant elsewhere.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      omitGlobalMethodsHookup,
      // Remove "useRNScreensOverlay" and "rnScreensOverlayViewStyle" as it is only used in the render
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useRNScreensOverlay,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rnScreensOverlayViewStyle,
      ...props
    } = this.props;

    const params = {
      ...props,
      ...functionParams,
      componentProps: {
        ...props?.componentProps,
        ...functionParams?.componentProps,
      },
    };

    if (this.isShown) {
      switch (params.queueMode) {
        case 'standby': {
          this.callStack.push(params);
          break;
        }
        case 'next': {
          this.callStack.unshift(params);
          break;
        }
        case 'immediate': {
          this.callStack.unshift(params);
          this.hideNotification();
          break;
        }
        default: {
          this.callStack = [params];
          this.hideNotification();
          break;
        }
      }
      return;
    }

    const {
      title,
      description,
      swipeEnabled,
      Component,
      componentProps,
      translucentStatusBar,
      containerStyle,
      containerProps,
      onShown,
      swipeDirection = 'top',
      ...restParams
    } = params;

    let additionalState: FinalTranslateValue | undefined;
    if (this.state.swipeDirection !== swipeDirection) {
      additionalState = getFinalTranslateValue({
        swipeDirection,
        animationDriver: this.animationDriver,
        hiddenTranslateXValue: this.hiddenTranslateXValue,
        hiddenTranslateYValue: this.hiddenTranslateYValue,
        translateX: this.translateX,
        translateY: this.translateY,
      });
    }

    this.setState({
      title,
      description,
      Component: Component ?? NotificationComponent,
      swipeEnabled: swipeEnabled ?? DEFAULT_SWIPE_ENABLED,
      componentProps: componentProps,
      translucentStatusBar,
      containerStyle,
      containerProps,
      swipeDirection,
      // TODO: fix types (definitely need useMemo)
      ...(additionalState ? additionalState : {}),
    });

    this.showParams = restParams;
    this.isShown = true;

    this.setHideTimer();

    this.translateY.setValue(0);
    this.translateX.setValue(0);
    this.hiddenTranslateYValue.setValue(-MAX_VALUE);
    this.hiddenTranslateXValue.setValue(0);
    Animated.timing(this.animationDriver, {
      toValue: 1,
      easing: this.showParams?.showEasing ?? this.showParams?.easing,
      duration:
        this.showParams?.showAnimationDuration ??
        this.showParams?.animationDuration ??
        DEFAULT_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(onShown);
  }

  public clearQueue(hideDisplayedNotification?: boolean) {
    this.callStack = [];

    if (hideDisplayedNotification) {
      this.hideNotification();
    }
  }

  private setHideTimer() {
    const { duration = DEFAULT_DURATION } = this.showParams ?? {};
    clearTimeout(this.hideTimer);
    if (duration && !isNaN(duration)) {
      this.hideTimer = setTimeout(this.hideNotification, duration);
    }
  }

  private onStartHiding() {
    this.showParams?.onStartHiding?.();
    this.isHiding = true;
    clearTimeout(this.hideTimer);
  }

  private onHidden() {
    this.showParams?.onHidden?.();
    this.isShown = false;
    this.isHiding = false;
    this.showParams = null;

    this.translateY.setValue(0);
    this.translateX.setValue(0);
    this.hiddenTranslateXValue.setValue(0);
    this.hiddenTranslateYValue.setValue(-MAX_VALUE);

    const nextNotification = this.callStack.shift();
    if (nextNotification) {
      this.showNotification(nextNotification);
    }
  }

  private onHandlerStateChange({
    nativeEvent,
  }: PanGestureHandlerStateChangeEvent) {
    if (nativeEvent.state === State.ACTIVE) {
      clearTimeout(this.hideTimer);
    }
    if (nativeEvent.oldState !== State.ACTIVE) {
      return;
    }
    this.setHideTimer();

    const swipePixelsToClose =
      this.showParams?.swipePixelsToClose ?? SWIPE_PIXELS_TO_CLOSE;

    const swipedOutDirection = getSwipedOutDirection({
      swipeDirection: this.state.swipeDirection,
      swipePixelsToClose,
      translationX: nativeEvent.translationX,
      translationY: nativeEvent.translationY,
    });

    if (swipedOutDirection === 'none') {
      animateTranslationReset({
        translateX: this.translateX,
        translateY: this.translateY,
      });
      return;
    }

    const { hiddenTranslateXValue, hiddenTranslateYValue } =
      getHiddenTranslateValues({
        swipedOutDirection,
        componentHeight: this.componentHeight,
        componentWidth: this.componentWidth,
      });

    this.hiddenTranslateYValue.setValue(hiddenTranslateYValue);
    this.hiddenTranslateXValue.setValue(hiddenTranslateXValue);

    Animated.timing(this.animationDriver, {
      toValue: 0,
      easing: this.showParams?.swipeEasing,
      duration:
        this.showParams?.swipeAnimationDuration ?? SWIPE_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      this.onHidden();
    });

    this.onStartHiding();
  }

  private onPress() {
    this.showParams?.onPress?.();
    if (this.showParams?.hideOnPress !== false) {
      this.hideNotification();
    }
  }

  private onLayout({ nativeEvent }: LayoutChangeEvent) {
    if (!this.isShown) return;

    this.componentHeight =
      nativeEvent.layout.height + SAFETY_MARGIN_TO_COMPONENT_SIZE;
    this.componentWidth =
      nativeEvent.layout.width + SAFETY_MARGIN_TO_COMPONENT_SIZE;
    console.log(
      Date.now(),
      'layout',
      this.componentHeight,
      this.componentWidth
    );
    this.hiddenTranslateYValue.setValue(-this.componentHeight);
    this.hiddenTranslateXValue.setValue(0);
  }

  render() {
    const { useRNScreensOverlay, rnScreensOverlayViewStyle } = this.props;
    const {
      title,
      description,
      swipeEnabled,
      Component,
      componentProps,
      translucentStatusBar,
      containerStyle,
      containerProps,
      finalTranslateX,
      finalTranslateY,
    } = this.state;

    const additionalContainerStyle =
      // TODO: fix custom animations (pass all values)
      typeof containerStyle === 'function'
        ? containerStyle(this.translateY)
        : containerStyle;

    return (
      <FullWindowOverlay
        useOverlay={useRNScreensOverlay}
        viewStyle={rnScreensOverlayViewStyle}
      >
        <PanGestureHandler
          enabled={swipeEnabled}
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onHandlerStateChange}
        >
          <Animated.View
            {...containerProps}
            style={[
              styles.container,
              {
                transform: [
                  { translateX: finalTranslateX },
                  { translateY: finalTranslateY },
                ],
              },
              additionalContainerStyle,
            ]}
          >
            <TouchableWithoutFeedback onPress={this.onPress}>
              <View
                onLayout={this.onLayout}
                // TODO: do something with this hack (it was needed to trigger onLayout each time)
                key={Math.random()}
                style={
                  Platform.OS === 'android' && translucentStatusBar
                    ? styles.translucentStatusBarPadding
                    : undefined
                }
              >
                <Component
                  title={title}
                  description={description}
                  {...componentProps}
                />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </PanGestureHandler>
      </FullWindowOverlay>
    );
  }
}
