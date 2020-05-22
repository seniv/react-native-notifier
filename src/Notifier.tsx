import React from 'react';
import { Animated, View, TouchableWithoutFeedback } from 'react-native';
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import s from './Notifier.styles';
import { Notification as NotificationComponent } from './components';
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_DURATION,
  MAX_SWIPE_Y,
  MIN_SWIPE_Y,
  SWIPE_ANIMATION_DURATION,
  SWIPE_PIXELS_TO_CLOSE,
  DEFAULT_SWIPE_ENABLED,
  ADDITIONAL_COMPONENT_MARGIN,
} from './constants';
import {
  ShowParams,
  ShowNotificationParams,
  StateInterface,
  EndCallback,
  NotifierInterface,
  AnimationState,
} from './types';

export const Notifier: NotifierInterface = {
  showNotification: () => {},
  hideNotification: () => {},
};

export class NotifierRoot extends React.PureComponent<ShowNotificationParams, StateInterface> {
  private isShown: boolean;
  private isHiding: boolean;
  private hideTimer: any;
  private showParams: ShowParams | null;
  private callStack: Array<ShowNotificationParams>;

  private readonly animationState: Animated.Value;
  private readonly componentHeight: Animated.Value;
  private readonly swipeTranslationY: Animated.Value;
  private readonly animationTranslateY: Animated.AnimatedMultiplication;
  private readonly swipeTranslationYInterpolated: Animated.AnimatedInterpolation;
  private readonly onGestureEvent: (...args: any[]) => void;
  private readonly onLayoutEvent: (...args: any[]) => void;

  constructor(props: ShowNotificationParams) {
    super(props);

    this.state = {
      Component: NotificationComponent,
      swipeEnabled: DEFAULT_SWIPE_ENABLED,
      componentProps: {},
    };
    this.isShown = false;
    this.isHiding = false;
    this.hideTimer = null;
    this.showParams = null;
    this.callStack = [];

    this.animationState = new Animated.Value(AnimationState.Hidden);
    this.componentHeight = new Animated.Value(Math.abs(MIN_SWIPE_Y));
    this.swipeTranslationY = new Animated.Value(0);

    this.animationTranslateY = Animated.multiply(
      this.animationState,
      Animated.add(this.componentHeight, ADDITIONAL_COMPONENT_MARGIN)
    );
    this.swipeTranslationYInterpolated = this.swipeTranslationY.interpolate({
      inputRange: [MIN_SWIPE_Y, MAX_SWIPE_Y],
      outputRange: [MIN_SWIPE_Y, MAX_SWIPE_Y],
      extrapolate: 'clamp',
    });

    this.onGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this.swipeTranslationY } }],
      { useNativeDriver: true }
    );
    this.onLayoutEvent = Animated.event(
      [{ nativeEvent: { layout: { height: this.componentHeight } } }],
      { useNativeDriver: true }
    );

    this.onPress = this.onPress.bind(this);
    this.onHandlerStateChange = this.onHandlerStateChange.bind(this);
    this.showNotification = this.showNotification.bind(this);
    this.hideNotification = this.hideNotification.bind(this);

    Notifier.showNotification = this.showNotification;
    Notifier.hideNotification = this.hideNotification;
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimer);
  }

  public hideNotification(callback?: EndCallback) {
    if (!this.isShown || this.isHiding) {
      return;
    }

    Animated.timing(this.animationState, {
      toValue: AnimationState.Hidden,
      easing: this.showParams?.hideEasing ?? this.showParams?.easing,
      duration:
        this.showParams?.hideAnimationDuration ??
        this.showParams?.animationDuration ??
        DEFAULT_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(result => {
      this.onHidden();
      callback?.(result);
    });

    this.onStartHiding();
  }

  public showNotification(functionParams: ShowNotificationParams) {
    const params = {
      ...this.props,
      ...functionParams,
      componentProps: { ...this.props?.componentProps, ...functionParams?.componentProps },
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
      duration = DEFAULT_DURATION,
      title,
      description,
      swipeEnabled,
      Component,
      componentProps,
      ...restParams
    } = params;

    this.setState({
      title,
      description,
      Component: Component ?? NotificationComponent,
      swipeEnabled: swipeEnabled ?? DEFAULT_SWIPE_ENABLED,
      componentProps: componentProps,
    });

    this.showParams = restParams;
    this.isShown = true;

    if (duration && !isNaN(duration)) {
      this.hideTimer = setTimeout(this.hideNotification, duration);
    }

    Animated.timing(this.animationState, {
      toValue: AnimationState.Shown,
      easing: this.showParams?.showEasing ?? this.showParams?.easing,
      duration:
        this.showParams?.showAnimationDuration ??
        this.showParams?.animationDuration ??
        DEFAULT_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
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

    const nextNotification = this.callStack.shift();
    if (nextNotification) {
      this.showNotification(nextNotification);
    }
  }

  private onHandlerStateChange({ nativeEvent }: PanGestureHandlerStateChangeEvent) {
    if (nativeEvent.oldState !== State.ACTIVE) {
      return;
    }

    const swipePixelsToClose = -(this.showParams?.swipePixelsToClose ?? SWIPE_PIXELS_TO_CLOSE);
    const isSwipedOut = nativeEvent.translationY < swipePixelsToClose;

    Animated.timing(isSwipedOut ? this.animationState : this.swipeTranslationY, {
      toValue: isSwipedOut ? AnimationState.Hidden : MAX_SWIPE_Y,
      easing: this.showParams?.swipeEasing,
      duration: this.showParams?.swipeAnimationDuration ?? SWIPE_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      if (isSwipedOut) {
        this.swipeTranslationY.setValue(0);
        this.onHidden();
      }
    });

    if (isSwipedOut) {
      this.onStartHiding();
    }
  }

  private onPress() {
    this.showParams?.onPress?.();
    if (this.showParams?.hideOnPress !== false) {
      this.hideNotification();
    }
  }

  render() {
    const { title, description, swipeEnabled, Component, componentProps } = this.state;

    return (
      <PanGestureHandler
        enabled={swipeEnabled}
        onGestureEvent={this.onGestureEvent}
        onHandlerStateChange={this.onHandlerStateChange}
      >
        <Animated.View
          onLayout={this.onLayoutEvent}
          style={[
            s.container,
            {
              transform: [
                { translateY: this.animationTranslateY },
                { translateY: this.swipeTranslationYInterpolated },
              ],
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={this.onPress}>
            <View>
              <Component title={title} description={description} {...componentProps} />
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </PanGestureHandler>
    );
  }
}
