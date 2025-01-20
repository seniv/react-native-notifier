import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { getHiddenTranslateValues } from '../utils/animationDirection';
import type { Direction, Notification } from '../types';
import { FABRIC_ENABLED, MAX_VALUE } from '../constants';

/**
 * Calculates component dimensions and hiddenTranslate* values by using reference and onLayout function
 * Also, can update hiddenTranslate* values by using updateHiddenValueByDirection function depending on the direction
 */
export const useLayout = ({ enterFrom }: Notification) => {
  const [isLayoutReady, setLayoutReady] = useState(false);
  const isLayoutReadyRef = useRef(false);
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

  const updateLayoutValues = useCallback(
    ({ height, width }: { height: number; width: number }) => {
      componentHeightRef.current = height;
      componentWidthRef.current = width;
      componentHeight.setValue(height);
      componentWidth.setValue(width);

      updateHiddenValueByDirection(currentDirection.current);

      // use ref to store the "isLayoutReady" value because calling setLayoutReady(true) more than once
      // in the new architecture triggers render more than once.
      if (!isLayoutReadyRef.current) {
        setLayoutReady(true);
        isLayoutReadyRef.current = true;
      }
    },
    [componentHeight, componentWidth, updateHiddenValueByDirection]
  );

  const measureLayout = useCallback(() => {
    if (!FABRIC_ENABLED) {
      ref.current?.measureInWindow((_x, _y, width, height) =>
        updateLayoutValues({ width, height })
      );
      return;
    }

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

    updateLayoutValues({ width: rect.width, height: rect.height });
  }, [updateLayoutValues]);

  useLayoutEffect(() => {
    if (!FABRIC_ENABLED) return;
    measureLayout();
  });

  const shouldIgnoreLayoutRef = useRef(FABRIC_ENABLED);
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
    isLayoutReady,
  };
};
