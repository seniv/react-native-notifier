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
import { styles, positionStyles } from '../Notifier.styles';
import { AnimationState, type Notification } from '../types';
import { useGestureEvent, useLayout } from './NotifierRenderer.hooks';
import { getSwipedOutDirection } from '../utils/animationDirection';
import { resetSwipeAnimation } from '../utils/animations';
import { RenderComponentWithOffsets } from '../RenderComponentWithOffsets';

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
 * 2. Synchronously calculate layout using "useLayout" hook, set component dimensions (height, width, hidden values)
 * 3. Start "showing" animation in useEffect
 * 4. When notification is shown, start "hiding" timer if needed, handle user interaction such as press or gesture
 * 5. Start "hiding" animation when timer is finished or by user interaction
 * 6. When notification is hidden, call "onHiddenCallback" method after which this component will be unmounted
 */
const NotifierRendererComponent = forwardRef<
  NotifierRendererMethods,
  NotifierRendererProps
>(({ notification, onHiddenCallback }, notificationRef) => {
  const {
    componentHeight,
    componentWidth,
    hiddenTranslateXValue,
    hiddenTranslateYValue,
    onLayout,
    updateHiddenValueByDirection,
    ref,
  } = useLayout({
    enterFrom: notification.enterFrom,
  });

  const { onGestureEvent, swipeTranslationX, swipeTranslationY } =
    useGestureEvent();

  const animationState = useRef(
    new Animated.Value(AnimationState.Hidden)
  ).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isHidingRef = useRef(false);

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

    updateHiddenValueByDirection(notification.exitTo);

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

    const swipedOutDirection = getSwipedOutDirection({
      swipeDirection: notification.swipeDirection,
      swipePixelsToClose: notification.swipePixelsToClose,
      translationX: nativeEvent.translationX,
      translationY: nativeEvent.translationY,
    });

    if (swipedOutDirection === 'none') {
      resetSwipeAnimation({
        notification,
        swipeTranslationX,
        swipeTranslationY,
      });
      return;
    }

    updateHiddenValueByDirection(swipedOutDirection);

    Animated.timing(animationState, {
      toValue: AnimationState.Hidden,
      easing: notification.swipeEasing,
      duration: notification.swipeAnimationDuration,
      useNativeDriver: true,
    }).start(onHidden);

    onStartHiding();
  };

  const onPress = () => {
    notification.onPress?.();
    if (notification.hideOnPress !== false) {
      hideNotification();
    }
  };

  return (
    <PanGestureHandler
      enabled={notification.swipeDirection !== 'none'}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        {...notification.containerProps}
        ref={ref}
        style={[
          styles.container,
          positionStyles[notification.position],
          notification.containerStyle,
          notification.animationFunction({
            swipeDirection: notification.swipeDirection,
            animationState,
            componentHeight,
            componentWidth,
            hiddenTranslateXValue,
            hiddenTranslateYValue,
            swipeTranslationX,
            swipeTranslationY,
          }),
        ]}
      >
        <TouchableWithoutFeedback onPress={onPress}>
          <View ref={ref} onLayout={onLayout}>
            <RenderComponentWithOffsets notification={notification} />
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </PanGestureHandler>
  );
});

export const NotifierRenderer = memo(NotifierRendererComponent);

NotifierRendererComponent.displayName = 'ForwardRef(NotifierRenderer)';
NotifierRenderer.displayName = 'Memo(NotifierRenderer)';
