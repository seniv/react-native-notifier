import React from 'react';
import { Animated, View, TouchableWithoutFeedback } from 'react-native';
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import s from './Notifier.styles';
import { MainComponent } from './components';
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_DURATION,
  MAX_TRANSLATE_Y,
  MIN_TRANSLATE_Y,
  SWIPE_ANIMATION_DURATION,
  SWIPE_PIXELS_TO_CLOSE,
  DEFAULT_SWIPE_ENABLED,
} from './constants';
import {
  ShowParams,
  ShowNotification,
  StateInterface,
  EndCallback,
  NotifierInterface,
} from './types';

export const Notifier: NotifierInterface = {
  showNotification: () => {},
  hideNotification: () => {},
};

export class NotifierRoot extends React.PureComponent<{}, StateInterface> {
  private isShown: boolean;
  private hideTimer: any;
  private showParams: ShowParams | null;
  private readonly translateY: Animated.Value;
  private readonly translateYInterpolated: Animated.AnimatedInterpolation;
  private readonly onGestureEvent: (...args: any[]) => void;

  constructor(props: {}) {
    super(props);

    this.state = {
      Component: MainComponent,
      swipeEnabled: DEFAULT_SWIPE_ENABLED,
      componentProps: {},
    };
    this.isShown = false;
    this.hideTimer = null;
    this.showParams = null;

    this.translateY = new Animated.Value(MIN_TRANSLATE_Y);
    this.translateYInterpolated = this.translateY.interpolate({
      inputRange: [MIN_TRANSLATE_Y, MAX_TRANSLATE_Y],
      outputRange: [MIN_TRANSLATE_Y, MAX_TRANSLATE_Y],
      extrapolate: 'clamp',
    });

    this.onGestureEvent = Animated.event(
      [
        {
          nativeEvent: { translationY: this.translateY },
        },
      ],
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
    if (!this.isShown) {
      return;
    }

    Animated.timing(this.translateY, {
      toValue: MIN_TRANSLATE_Y,
      easing: this.showParams?.hideEasing ?? this.showParams?.easing,
      duration:
        this.showParams?.hideAnimationDuration ??
        this.showParams?.animationDuration ??
        DEFAULT_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(callback);

    this.onHide();
  }

  public showNotification(params: ShowNotification) {
    if (this.isShown) {
      this.hideNotification(() => {
        this.showNotification(params);
      });
      return;
    }

    const {
      duration = DEFAULT_DURATION,
      title,
      description,
      swipeEnabled,
      Component,
      componentProps,
      imageSource,
      ...restParams
    } = params ?? {};
    this.setState({
      title,
      description,
      Component: Component ?? MainComponent,
      swipeEnabled: swipeEnabled ?? DEFAULT_SWIPE_ENABLED,
      componentProps: componentProps ?? {},
      imageSource,
    });
    this.showParams = restParams;
    if (duration && !isNaN(duration)) {
      this.hideTimer = setTimeout(this.hideNotification, duration);
    }
    this.isShown = true;

    Animated.timing(this.translateY, {
      toValue: MAX_TRANSLATE_Y,
      easing: this.showParams?.showEasing ?? this.showParams?.easing,
      duration:
        this.showParams?.showAnimationDuration ??
        this.showParams?.animationDuration ??
        DEFAULT_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }

  private onHide() {
    this.showParams?.onHide?.();
    clearTimeout(this.hideTimer);
    this.isShown = false;
    this.showParams = null;
  }

  private onHandlerStateChange({ nativeEvent }: PanGestureHandlerStateChangeEvent) {
    if (nativeEvent.oldState !== State.ACTIVE) {
      return;
    }

    const swipePixelsToClose = -(this.showParams?.swipePixelsToClose ?? SWIPE_PIXELS_TO_CLOSE);
    const isSwipedOut = nativeEvent.translationY < swipePixelsToClose;

    Animated.timing(this.translateY, {
      toValue: isSwipedOut ? MIN_TRANSLATE_Y : MAX_TRANSLATE_Y,
      easing: this.showParams?.swipeEasing,
      duration: this.showParams?.swipeAnimationDuration ?? SWIPE_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    if (isSwipedOut) {
      this.onHide();
    }
  }

  private onPress() {
    this.showParams?.onPress?.();
    if (this.showParams?.hideOnPress !== false) {
      this.hideNotification();
    }
  }

  render() {
    const { title, description, swipeEnabled, Component, componentProps, imageSource } = this.state;

    return (
      <PanGestureHandler
        enabled={swipeEnabled}
        onGestureEvent={this.onGestureEvent}
        onHandlerStateChange={this.onHandlerStateChange}
      >
        <Animated.View
          style={[
            s.container,
            {
              transform: [
                {
                  translateY: this.translateYInterpolated,
                },
              ],
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={this.onPress}>
            <View>
              <Component
                title={title}
                description={description}
                imageSource={imageSource}
                {...componentProps}
              />
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </PanGestureHandler>
    );
  }
}
