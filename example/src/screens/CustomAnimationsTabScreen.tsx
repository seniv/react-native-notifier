import { Notifier } from 'react-native-notifier';
import Button from '../components/Button';
import { ScrollView } from 'react-native';
import { isAndroid } from '../constants';
import {
  getContainerStyleBottomPosition,
  getContainerStyleClassicWithOverSwipe,
  getContainerStyleOpacityOnly,
  getContainerStyleOpacityTransformScale,
  getContainerStyleScaleAndRotation,
  getContainerStyleScaleOnly,
  getContainerStyleWithTranslateAndScale,
} from '../customAnimations';

// "needsOffscreenAlphaCompositing" prop is needed to fix shadows on android when using "opacity" style in container
const animatedContainerProps = isAndroid
  ? { needsOffscreenAlphaCompositing: true }
  : undefined;

export const CustomAnimationsTabScreen = () => {
  return (
    <ScrollView>
      <Button
        title="Opacity, TranslateY and Scale animation"
        onPress={() =>
          Notifier.showNotification({
            title: 'Opacity, TranslateY and Scale animation',
            description:
              'This notification uses Opacity and Transformation of Scale and TranslateY',
            containerStyle: getContainerStyleOpacityTransformScale,
            containerProps: animatedContainerProps,
            queueMode: 'standby',
          })
        }
      />
      <Button
        title="Pull down"
        onPress={() =>
          Notifier.showNotification({
            title: 'Pull down',
            description: 'Notification can be slightly pulled down',
            containerStyle: getContainerStyleClassicWithOverSwipe,
            queueMode: 'standby',
          })
        }
      />
      <Button
        title="Fade In/Out Notification"
        onPress={() =>
          Notifier.showNotification({
            title: 'Fade In/Out Notification',
            description:
              'This notification is faded in using Animated opacity style',
            containerStyle: getContainerStyleOpacityOnly,
            containerProps: animatedContainerProps,
            queueMode: 'standby',
          })
        }
      />
      <Button
        title="Zoom In/Out Animation"
        onPress={() =>
          Notifier.showNotification({
            title: 'Zoom In/Out Animation',
            description: 'Uses only Scale Transformation to zoom in',
            containerStyle: getContainerStyleScaleOnly,
            queueMode: 'standby',
          })
        }
      />
      <Button
        title="Zoom + Rotation"
        onPress={() =>
          Notifier.showNotification({
            title: 'Zoom + Rotation',
            description:
              'Scale and Rotate the notification. This is a MADNESS!',
            containerStyle: getContainerStyleScaleAndRotation,
            queueMode: 'standby',
          })
        }
      />
      <Button
        title="Animation from code example"
        onPress={() =>
          Notifier.showNotification({
            title: 'Animation from code example',
            description: 'Scale and Translate',
            containerStyle: getContainerStyleWithTranslateAndScale,
          })
        }
      />
      <Button
        title="Bottom Position"
        onPress={() =>
          Notifier.showNotification({
            title: 'Bottom Position',
            description: 'Moved to the bottom using containerStyle property',
            containerStyle: getContainerStyleBottomPosition,
            // Disable swipes because currently bottom position is not fully supported
            swipeEnabled: false,
          })
        }
      />
    </ScrollView>
  );
};
