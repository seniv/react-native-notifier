import {
  GestureDetector,
  TouchableWithoutFeedback,
  type PanGesture,
} from 'react-native-gesture-handler';
import { type ShowNotificationParams } from './types';
import { Platform, View, type LayoutChangeEvent } from 'react-native';
import { styles } from './Notifier.styles';
import Animated from 'react-native-reanimated';
import { useAnimationStyles } from './hooks/useAnimationStyles';
import { useNotifierInternal } from './contexts/internal';
import { notifierLog } from './utils/logger';

interface NotifierRenderProps extends Pick<ShowNotificationParams, 'onPress'> {
  onLayout: (event: LayoutChangeEvent) => void;
  onPress: () => void;
  pan: PanGesture;
}

export const NotifierRender = ({
  onLayout,
  onPress,
  pan,
}: NotifierRenderProps) => {
  // TODO: fix custom animations (pass all values)
  const animationStyles = useAnimationStyles();
  const { renderState } = useNotifierInternal();

  notifierLog('renderState', renderState);

  if (!renderState) return null;

  return (
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
  );
};
