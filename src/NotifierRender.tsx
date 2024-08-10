import {
  GestureDetector,
  TouchableWithoutFeedback,
  type PanGesture,
} from 'react-native-gesture-handler';
import { FullWindowOverlay } from './components/FullWindowOverlay';
import {
  NotifierState,
  type NotifierProps,
  type ShowNotificationParams,
} from './types';
import { Platform, View } from 'react-native';
import { styles } from './Notifier.styles';
import { useEffect, useState, type ElementType } from 'react';
import Animated, {
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { useLayout } from './hooks/useLayout';
import { useAnimationStyles } from './hooks/useAnimationStyles';
import { useNotifierInternal } from './contexts/internal';

interface NotifierRenderProps
  extends Pick<
      NotifierProps,
      'useRNScreensOverlay' | 'rnScreensOverlayViewStyle'
    >,
    Pick<
      ShowNotificationParams,
      | 'containerStyle'
      | 'componentProps'
      | 'translucentStatusBar'
      | 'containerProps'
      | 'onPress'
      | 'title'
      | 'description'
    > {
  pan: PanGesture;
  Component: ElementType;
}

export const NotifierRender = ({
  rnScreensOverlayViewStyle,
  useRNScreensOverlay,
  Component,
  // containerStyle,
  componentProps,
  translucentStatusBar,
  containerProps,
  onPress,
  description,
  title,
  pan,
}: NotifierRenderProps) => {
  // TODO: fix custom animations (pass all values)
  const { onLayout } = useLayout();
  const animationStyles = useAnimationStyles();
  const { notifierState } = useNotifierInternal();
  const [shouldRender, setShouldRender] = useState(false);

  useAnimatedReaction(
    () =>
      notifierState.value !== NotifierState.Hidden &&
      notifierState.value !== NotifierState.WaitingForUnmount,
    (nextShouldRender, previous) => {
      if (nextShouldRender !== previous) {
        runOnJS(setShouldRender)(nextShouldRender);
      }
    }
  );

  useEffect(() => {
    if (
      notifierState.value === NotifierState.WaitingForUnmount &&
      !shouldRender
    ) {
      notifierState.value = NotifierState.Hidden;
    }
  }, [shouldRender, notifierState]);

  console.log('shouldRender', shouldRender);

  return (
    <FullWindowOverlay
      useOverlay={useRNScreensOverlay}
      viewStyle={rnScreensOverlayViewStyle}
    >
      {shouldRender && (
        <GestureDetector gesture={pan}>
          <Animated.View
            {...containerProps}
            style={[styles.container, animationStyles]}
            onLayout={onLayout}
          >
            <TouchableWithoutFeedback onPress={onPress}>
              <View
                style={
                  Platform.OS === 'android' && translucentStatusBar
                    ? styles.translucentStatusBarPadding
                    : undefined
                }
              >
                <Component
                  title={title}
                  description={description}
                  {...componentProps}
                />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </GestureDetector>
      )}
    </FullWindowOverlay>
  );
};
