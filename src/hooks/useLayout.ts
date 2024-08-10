import { useCallback } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { SAFETY_MARGIN_TO_COMPONENT_SIZE } from '../constants';
import { useNotifierInternal } from '../contexts/internal';
import { NotifierState } from '../types';

export const useLayout = () => {
  const {
    componentHeight,
    componentWidth,
    notifierState,
    hiddenTranslateXValue,
    hiddenTranslateYValue,
  } = useNotifierInternal();

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      console.log(
        Date.now(),
        'layout',
        e.nativeEvent.layout.height,
        e.nativeEvent.layout.width
      );
      if (notifierState.value === NotifierState.WaitingForLayout) {
        notifierState.value = NotifierState.LayoutCalculated;
      }

      const height =
        e.nativeEvent.layout.height + SAFETY_MARGIN_TO_COMPONENT_SIZE;
      const width =
        e.nativeEvent.layout.width + SAFETY_MARGIN_TO_COMPONENT_SIZE;
      componentHeight.value = height;
      componentWidth.value = width;
      hiddenTranslateXValue.value = 0;
      hiddenTranslateYValue.value = -height;
    },
    [
      componentHeight,
      componentWidth,
      hiddenTranslateXValue,
      hiddenTranslateYValue,
      notifierState,
    ]
  );

  return {
    onLayout,
  };
};
