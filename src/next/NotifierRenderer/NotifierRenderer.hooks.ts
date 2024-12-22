import { useCallback, useLayoutEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export const useLayout = () => {
  const ref = useRef<View>(null);
  const componentHeight = useRef(new Animated.Value(1)).current;

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

    componentHeight.setValue(rect.height);
  }, [componentHeight]);

  useLayoutEffect(measureLayout);

  const shouldIgnoreLayoutRef = useRef(true);
  const onLayout = useCallback(() => {
    if (shouldIgnoreLayoutRef) {
      shouldIgnoreLayoutRef.current = false;
      return;
    }
    measureLayout();
  }, [measureLayout]);

  return {
    componentHeight,
    ref,
    onLayout,
  };
};
