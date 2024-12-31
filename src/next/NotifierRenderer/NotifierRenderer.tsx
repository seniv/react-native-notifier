import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
  type PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { Animated, View } from 'react-native';
import styles from '../Notifier.styles';
import { AnimationState, type Notification } from '../types';
import { useLayout } from './NotifierRenderer.hooks';
import { MAX_SWIPE_Y } from '../constants';

export interface NotifierRendererMethods {
  hideNotification: (callback?: Animated.EndCallback) => void;
}
interface NotifierRendererProps {
  notification: Notification;
  onHiddenCallback: () => void;
}
/**
 * Component that is responsible for displaying one notification on the Screen and all user interaction.
 *
 * Lifecycle:
 * 1. Component gets mounted in hidden state
 * 2. Synchronously calculate layout using "useLayout" hook, set componentHeight
 * 3. Start "showing" animation in useEffect
 * 4. When notification is shown, start "hiding" timer if needed, handle user interaction such as press or gesture
 * 5. Start "hiding" animation when timer is finished or by user interaction
 * 6. When notification is hidden, call "onHiddenCallback" method after which this component will be unmounted
 */
const NotifierRendererComponent = forwardRef<
  NotifierRendererMethods,
  NotifierRendererProps
>(({ notification, onHiddenCallback }, notificationRef) => {
  const { componentHeight, onLayout, ref } = useLayout();
  const animationState = useRef(
    new Animated.Value(AnimationState.Hidden)
  ).current;
  const swipeTranslationY = useRef(new Animated.Value(0)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isHidingRef = useRef(false);

  const onGestureEvent = useRef(
    Animated.event([{ nativeEvent: { translationY: swipeTranslationY } }], {
      useNativeDriver: true,
    })
  ).current;

  const onStartHiding = () => {
    notification.onStartHiding?.();
    isHidingRef.current = true;
    clearTimeout(hideTimerRef.current);
  };

  const onHidden = () => {
    notification.onHidden?.();
    onHiddenCallback();
  };

  const hideNotification = (callback?: Animated.EndCallback) => {
    if (isHidingRef.current) return;

    Animated.timing(animationState, {
      toValue: AnimationState.Hidden,
      easing: notification.hideEasing,
      duration: notification.hideAnimationDuration,
      useNativeDriver: true,
    }).start((result) => {
      onHidden();
      callback?.(result);
    });

    onStartHiding();
  };

  useImperativeHandle(notificationRef, () => ({
    hideNotification,
  }));

  const setHideTimer = () => {
    const duration = notification.duration;
    clearTimeout(hideTimerRef.current);
    if (duration && !isNaN(duration)) {
      hideTimerRef.current = setTimeout(hideNotification, duration);
    }
  };

  useEffect(() => {
    Animated.timing(animationState, {
      toValue: AnimationState.Shown,
      easing: notification.showEasing,
      duration: notification.showAnimationDuration,
      useNativeDriver: true,
    }).start(() => {
      setHideTimer();
      notification.onShown?.();
    });

    return () => {
      clearTimeout(hideTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHandlerStateChange = ({
    nativeEvent,
  }: PanGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state === State.ACTIVE) {
      clearTimeout(hideTimerRef.current);
    }
    if (nativeEvent.oldState !== State.ACTIVE) {
      return;
    }
    setHideTimer();

    const swipePixelsToClose = -notification.swipePixelsToClose;
    const isSwipedOut = nativeEvent.translationY < swipePixelsToClose;

    Animated.timing(isSwipedOut ? animationState : swipeTranslationY, {
      toValue: isSwipedOut ? AnimationState.Hidden : MAX_SWIPE_Y,
      easing: notification.swipeEasing,
      duration: notification.swipeAnimationDuration,
      useNativeDriver: true,
    }).start(() => {
      if (isSwipedOut) {
        onHidden();
      }
    });

    if (isSwipedOut) {
      onStartHiding();
    }
  };

  const onPress = () => {
    notification.onPress?.();
    if (notification.hideOnPress !== false) {
      hideNotification();
    }
  };

  const { Component, containerStyle, animationFunction } = notification;

  return (
    <PanGestureHandler
      enabled={notification.swipeEnabled}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        {...notification.containerProps}
        ref={ref}
        style={[
          styles.container,
          containerStyle,
          animationFunction({
            animationState,
            componentHeight,
            swipeTranslationY,
          }),
        ]}
      >
        <TouchableWithoutFeedback onPress={onPress}>
          <View ref={ref} onLayout={onLayout}>
            <Component
              title={notification.title}
              description={notification.description}
              {...notification.componentProps}
            />
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </PanGestureHandler>
  );
});

export const NotifierRenderer = memo(NotifierRendererComponent);

NotifierRendererComponent.displayName = 'ForwardRef(NotifierRenderer)';
NotifierRenderer.displayName = 'Memo(NotifierRenderer)';
