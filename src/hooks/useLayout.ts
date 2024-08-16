import { useCallback } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { SAFETY_MARGIN_TO_COMPONENT_SIZE } from '../constants';
import { useNotifierInternal } from '../contexts/internal';
import { NotifierState } from '../types';
import { notifierLog } from '../utils/logger';

export const useLayout = (onLayoutCalculated: () => void) => {
  const {
    componentHeight,
    componentWidth,
    notifierState,
    hiddenTranslateXValue,
    hiddenTranslateYValue,
    setNotifierState,
  } = useNotifierInternal();

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      notifierLog(
        'layout',
        e.nativeEvent.layout.height,
        e.nativeEvent.layout.width
      );
      if (notifierState.current === NotifierState.WaitingForLayout) {
        setNotifierState(NotifierState.LayoutCalculated);
        onLayoutCalculated();
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
      onLayoutCalculated,
      setNotifierState,
    ]
  );

  return {
    onLayout,
  };
};
