import { useCallback, useLayoutEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { getHiddenTranslateValues } from '../utils/animationDirection';
import type { Direction, Notification } from '../types';
import { MAX_VALUE } from '../constants';
import { runResetSwipeAnimation } from '../utils/animations';

/**
 * Calculates component dimensions and hiddenTranslate* values by using reference and onLayout function
 * Also, can update hiddenTranslate* values by using updateHiddenValueByDirection function depending on the direction
 */
export const useLayout = ({ enterFrom }: Notification) => {
  const ref = useRef<View>(null);
  // store current direction to handle the case when component dimensions changes (trigger onLayout)
  // while active direction != enterFrom (e.g. when exitTo is different than enterFrom, and notification started hiding animation).
  const currentDirection = useRef(enterFrom);

  // store component height and width it both Animated.Value and regular number.
  // regular number is used when we change hiddenTranslate values in updateHiddenValueByDirection function
  // and Animated.Value is passed to animationFunction for convenience of creating custom animation
  const componentHeightRef = useRef(0);
  const componentWidthRef = useRef(0);
  const componentHeight = useRef(new Animated.Value(MAX_VALUE)).current;
  const componentWidth = useRef(new Animated.Value(MAX_VALUE)).current;

  // store hidden hiddenTranslate values that changes depending on direction from which, or to which notification should animate
  // this value dynamically changes it 3 cases:
  // 1. when notification appears, it will have values depending on enterFrom params and component dimensions
  // 2. when "hiding" animation starts, it will have values depending on exitTo param and component dimensions
  // 3. when user manually swipe-out the notification, it will depend on direction of the swipe, which depends on swipeDirection params.
  const hiddenTranslateYValue = useRef(new Animated.Value(-MAX_VALUE)).current;
  const hiddenTranslateXValue = useRef(new Animated.Value(-MAX_VALUE)).current;

  const layoutAnimationValues = useRef({
    componentHeight,
    componentWidth,
    hiddenTranslateYValue,
    hiddenTranslateXValue,
  }).current;

  const updateHiddenValueByDirection = useCallback(
    (direction: Direction) => {
      currentDirection.current = direction;

      const hiddenTranslateValues = getHiddenTranslateValues({
        direction,
        componentHeight: componentHeightRef.current,
        componentWidth: componentWidthRef.current,
      });

      hiddenTranslateXValue.setValue(
        hiddenTranslateValues.hiddenTranslateXValue
      );
      hiddenTranslateYValue.setValue(
        hiddenTranslateValues.hiddenTranslateYValue
      );
    },
    [hiddenTranslateXValue, hiddenTranslateYValue]
  );

  const measureLayout = useCallback(() => {
    // TODO: update function once "getBoundingClientRect" function will be officially released
    // @ts-ignore
    let rect = ref.current?.getBoundingClientRect?.();
    if (!rect) {
      // @ts-ignore
      rect = ref.current?.unstable_getBoundingClientRect?.();
    }
    if (!rect) {
      ref.current?.measureInWindow((x, y, width, height) => {
        rect = { x, y, width, height };
      });
    }

    componentHeightRef.current = rect.height;
    componentWidthRef.current = rect.width;
    componentHeight.setValue(rect.height);
    componentWidth.setValue(rect.width);

    updateHiddenValueByDirection(currentDirection.current);
  }, [componentHeight, componentWidth, updateHiddenValueByDirection]);

  useLayoutEffect(measureLayout);

  const shouldIgnoreLayoutRef = useRef(true);
  const onLayout = useCallback(() => {
    if (shouldIgnoreLayoutRef.current) {
      shouldIgnoreLayoutRef.current = false;
      return;
    }
    measureLayout();
  }, [measureLayout]);

  return {
    layoutAnimationValues,
    ref,
    onLayout,
    updateHiddenValueByDirection,
  };
};

export const useSwipeAnimationValues = (notification: Notification) => {
  const swipeTranslationX = useRef(new Animated.Value(0)).current;
  const swipeTranslationY = useRef(new Animated.Value(0)).current;
  const swipeAnimationValues = useRef({
    swipeTranslationX,
    swipeTranslationY,
  }).current;

  const onGestureEvent = useRef(
    Animated.event(
      [
        {
          nativeEvent: {
            translationX: swipeTranslationX,
            translationY: swipeTranslationY,
          },
        },
      ],
      {
        useNativeDriver: true,
      }
    )
  ).current;

  const resetSwipeAnimation = useCallback(() => {
    runResetSwipeAnimation({
      notification,
      swipeTranslationX,
      swipeTranslationY,
    });
  }, [notification, swipeTranslationX, swipeTranslationY]);

  return {
    swipeAnimationValues,
    onGestureEvent,
    resetSwipeAnimation,
  };
};

export const useShaking = ({ shakingConfig }: Notification) => {
  const shakingTranslationX = useRef(new Animated.Value(0)).current;
  const shakingTranslationY = useRef(new Animated.Value(0)).current;
  const shakingAnimationValues = useRef({
    shakingTranslationX,
    shakingTranslationY,
  }).current;

  const shake = useCallback(() => {
    const { distance, vertical, numberOfRepeats, ...config } = shakingConfig;
    const value = vertical ? shakingTranslationY : shakingTranslationX;
    Animated.sequence([
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: distance,
            useNativeDriver: true,
            ...config,
          }),
          Animated.timing(value, {
            toValue: -distance,
            useNativeDriver: true,
            ...config,
          }),
        ]),
        {
          iterations: numberOfRepeats,
          resetBeforeIteration: false,
        }
      ),
      Animated.timing(value, {
        toValue: 0,
        useNativeDriver: true,
        ...config,
      }),
    ]).start();
  }, [shakingConfig, shakingTranslationX, shakingTranslationY]);

  return {
    shake,
    shakingAnimationValues,
  };
};
