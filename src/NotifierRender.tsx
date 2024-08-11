import {
  GestureDetector,
  TouchableWithoutFeedback,
  type PanGesture,
} from 'react-native-gesture-handler';
import { FullWindowOverlay } from './components/FullWindowOverlay';
import { type NotifierProps, type ShowNotificationParams } from './types';
import { Platform, View, type LayoutChangeEvent } from 'react-native';
import { styles } from './Notifier.styles';
import Animated from 'react-native-reanimated';
import { useAnimationStyles } from './hooks/useAnimationStyles';
import { useNotifierInternal } from './contexts/internal';

interface NotifierRenderProps
  extends Pick<
      NotifierProps,
      'useRNScreensOverlay' | 'rnScreensOverlayViewStyle'
    >,
    Pick<ShowNotificationParams, 'onPress'> {
  onLayout: (event: LayoutChangeEvent) => void;
  onPress: () => void;
  pan: PanGesture;
}

export const NotifierRender = ({
  rnScreensOverlayViewStyle,
  useRNScreensOverlay,
  onLayout,
  onPress,
  pan,
}: NotifierRenderProps) => {
  // TODO: fix custom animations (pass all values)
  const animationStyles = useAnimationStyles();
  const { renderState } = useNotifierInternal();

  console.log(Date.now(), 'renderState', renderState);

  return (
    <FullWindowOverlay
      useOverlay={useRNScreensOverlay}
      viewStyle={rnScreensOverlayViewStyle}
    >
      {renderState && (
        <GestureDetector gesture={pan}>
          <Animated.View
            {...renderState.containerProps}
            style={[styles.container, animationStyles]}
            onLayout={onLayout}
          >
            <TouchableWithoutFeedback onPress={onPress}>
              <View
                style={
                  Platform.OS === 'android' && renderState.translucentStatusBar
                    ? styles.translucentStatusBarPadding
                    : undefined
                }
              >
                <renderState.Component
                  title={renderState.title}
                  description={renderState.description}
                  {...renderState.componentProps}
                />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </GestureDetector>
      )}
    </FullWindowOverlay>
  );
};
