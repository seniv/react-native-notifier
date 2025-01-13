import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
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
import { useSwipeAnimationValues, useLayout } from './NotifierRenderer.hooks';
import { getSwipedOutDirection } from '../utils/animationDirection';
import { RenderComponentWithOffsets } from '../RenderComponentWithOffsets';
import { useShaking } from '../hooks/useShaking';

export interface NotifierRendererMethods {
  hideNotification(callback?: Animated.EndCallback): void;
  shake(): void;
  resetTimer(): void;
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
  const { layoutAnimationValues, onLayout, updateHiddenValueByDirection, ref } =
    useLayout(notification);
  const { shake, shakingAnimationValues } = useShaking(notification);

  const { onGestureEvent, resetSwipeAnimation, swipeAnimationValues } =
    useSwipeAnimationValues(notification);

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

  const onHidingAnimationFinished = (result: Animated.EndResult) => {
    if (!result.finished) {
      return;
    }
    notification.onHidden?.();
    onHiddenCallback();
  };

  const hideNotification = (callback?: Animated.EndCallback) => {
    if (isHidingRef.current) return;

    updateHiddenValueByDirection(notification.exitTo);

    Animated[notification.hideAnimationConfig.method](animationState, {
      useNativeDriver: true,
      ...notification.hideAnimationConfig.config,
      toValue: AnimationState.Hidden,
    }).start((result) => {
      onHidingAnimationFinished(result);
      callback?.(result);
    });

    onStartHiding();
  };

  const setHideTimer = () => {
    const duration = notification.duration;
    clearTimeout(hideTimerRef.current);
    if (duration && !isNaN(duration)) {
      hideTimerRef.current = setTimeout(hideNotification, duration);
    }
  };

  const resetTimer = () => {
    isHidingRef.current = false;
    setHideTimer();
    resetSwipeAnimation();
    Animated[notification.showAnimationConfig.method](animationState, {
      useNativeDriver: true,
      ...notification.showAnimationConfig.config,
      toValue: AnimationState.Shown,
    }).start();
  };

  useImperativeHandle(notificationRef, () => ({
    hideNotification,
    shake,
    resetTimer,
  }));

  useEffect(() => {
    Animated[notification.showAnimationConfig.method](animationState, {
      useNativeDriver: true,
      ...notification.showAnimationConfig.config,
      toValue: AnimationState.Shown,
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
      resetSwipeAnimation();
      return;
    }

    updateHiddenValueByDirection(swipedOutDirection);

    Animated[notification.swipeOutAnimationConfig.method](animationState, {
      useNativeDriver: true,
      ...notification.swipeOutAnimationConfig.config,
      toValue: AnimationState.Hidden,
    }).start(onHidingAnimationFinished);

    onStartHiding();
  };

  const onPress = () => {
    notification.onPress?.();
    if (notification.hideOnPress !== false) {
      hideNotification();
    }
  };

  const animationFunctionParam = useMemo(
    () => ({
      swipeDirection: notification.swipeDirection,
      animationState,
      ...layoutAnimationValues,
      ...swipeAnimationValues,
      ...shakingAnimationValues,
    }),
    [
      animationState,
      layoutAnimationValues,
      notification.swipeDirection,
      shakingAnimationValues,
      swipeAnimationValues,
    ]
  );
  const { animationFunction } = notification;
  const animationStyle = useMemo(
    () => animationFunction(animationFunctionParam),
    [animationFunction, animationFunctionParam]
  );

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
          animationStyle,
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
