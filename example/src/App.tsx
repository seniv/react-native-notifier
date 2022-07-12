import * as React from 'react';
import {
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView,
  SafeAreaView,
  View,
  Text,
} from 'react-native';
import { Easing, Notifier, NotifierRoot, NotifierComponents } from 'react-native-notifier';
import Modal from 'react-native-modal';
import Button from './Button';
import CustomComponent from './CustomComponent';
import {
  getContainerStyleBottomPosition,
  getContainerStyleClassicWithOverSwipe,
  getContainerStyleOpacityOnly,
  getContainerStyleOpacityTransformScale,
  getContainerStyleScaleAndRotation,
  getContainerStyleScaleOnly,
  getContainerStyleWithTranslateAndScale,
} from './customAnimations';
import Section from './Section';

const isAndroid = Platform.OS === 'android';

// "needsOffscreenAlphaCompositing" prop is needed to fix shadows on android when using "opacity" style in container
const animatedContainerProps = isAndroid ? { needsOffscreenAlphaCompositing: true } : undefined;

export default function App() {
  const notifierRef = React.useRef<NotifierRoot>(null);
  const [statusBar, setStatusBar] = React.useState(true);
  const [statusBarTranslucent, setStatusBarTranslucent] = React.useState(false);
  const [isModalVisible, setModalVisible] = React.useState(false);

  if (isAndroid) {
    StatusBar.setHidden(!statusBar);
    StatusBar.setTranslucent(statusBarTranslucent);
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Button
            title="Easing: bounce"
            onPress={() =>
              Notifier.showNotification({
                title: 'John Doe',
                description: 'Hello! Can you help me with notifications?',
                duration: 0,
                showAnimationDuration: 800,
                showEasing: Easing.bounce,
                hideEasing: Easing.circle,

                onStartHiding: () => console.log('Start Hiding'),
                onHidden: () => console.log('Hidden'),
                onPress: () => console.log('Press'),
                hideOnPress: false,

                swipePixelsToClose: 10,
              })
            }
          />
          <Button
            title="Long Text"
            onPress={() =>
              Notifier.showNotification({
                title: 'New request',
                duration: 6000,
                description:
                  'You just got new incoming request from John Doe, and this is a long description',
              })
            }
          />
          <Button
            title="With Image"
            onPress={() =>
              Notifier.showNotification({
                title: 'Check this image!',
                description: 'Cool, right?',
                queueMode: 'standby',
                componentProps: {
                  imageSource: require('./react.jpg'),
                },
              })
            }
          />
          <Button
            title="Error Alert"
            onPress={() =>
              Notifier.showNotification({
                title: 'The request was failed',
                description: 'Check your internet connection, please',
                Component: NotifierComponents.Alert,
                componentProps: {
                  alertType: 'error',
                },
              })
            }
          />
          <Button
            title="Successful Alert"
            onPress={() =>
              Notifier.showNotification({
                title: 'Your profile was successfully saved!',
                Component: NotifierComponents.Alert,
                componentProps: {
                  alertType: 'success',
                },
              })
            }
          />
          <Button title="Clear Queue" onPress={() => Notifier.clearQueue()} />
          <Button title="Clear Queue and Hide" onPress={() => Notifier.clearQueue(true)} />
          <Button
            title="Custom component"
            onPress={() =>
              notifierRef.current?.showNotification({
                title: 'Custom Component',
                description: 'You can pass component that you want to render',
                Component: CustomComponent,
              })
            }
          />
          <Button
            title="Using refs"
            onPress={() =>
              notifierRef.current?.showNotification({
                title: 'Called using ref!',
                description: 'Amazing!',
              })
            }
          />
          <Button
            title="Slow animation & onShown"
            onPress={() =>
              notifierRef.current?.showNotification({
                title: 'Called using ref!',
                description: 'Amazing!',
                showAnimationDuration: 5000,
                duration: 7000,
                onShown: () => console.log('Notification shown'),
              })
            }
          />
          <Button
            title="Styled Notification"
            onPress={() =>
              notifierRef.current?.showNotification({
                title: 'Styled Notification',
                description: 'Background should be green and title is white!',
                componentProps: {
                  containerStyle: {
                    backgroundColor: 'green',
                  },
                  titleStyle: {
                    color: 'white',
                  },
                  descriptionStyle: {
                    color: '#fafafa',
                  },
                },
              })
            }
          />
          <Section title="Custom Animations">
            <Button
              title="Opacity, TranslateY and Scale animation"
              onPress={() =>
                notifierRef.current?.showNotification({
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
                notifierRef.current?.showNotification({
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
                notifierRef.current?.showNotification({
                  title: 'Fade In/Out Notification',
                  description: 'This notification is faded in using Animated opacity style',
                  containerStyle: getContainerStyleOpacityOnly,
                  containerProps: animatedContainerProps,
                  queueMode: 'standby',
                })
              }
            />
            <Button
              title="Zoom In/Out Animation"
              onPress={() =>
                notifierRef.current?.showNotification({
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
                notifierRef.current?.showNotification({
                  title: 'Zoom + Rotation',
                  description: 'Scale and Rotate the notification. This is a MADNESS!',
                  containerStyle: getContainerStyleScaleAndRotation,
                  queueMode: 'standby',
                })
              }
            />
            <Button
              title="Animation from code example"
              onPress={() =>
                notifierRef.current?.showNotification({
                  title: 'Animation from code example',
                  description: 'Scale and Translate',
                  containerStyle: getContainerStyleWithTranslateAndScale,
                })
              }
            />
            <Button
              title="Bottom Position"
              onPress={() =>
                notifierRef.current?.showNotification({
                  title: 'Bottom Position',
                  description: 'Moved to the bottom using containerStyle property',
                  containerStyle: getContainerStyleBottomPosition,
                  // Disable swipes because currently bottom position is not fully supported
                  swipeEnabled: false,
                })
              }
            />
          </Section>
          <Button title="Hide" onPress={() => Notifier.hideNotification()} />
          <Button title="Open react-native-modal" onPress={() => setModalVisible(true)} />
          {isAndroid && (
            <>
              <Button title="Toggle Status Bar" onPress={() => setStatusBar((v) => !v)} />
              <Button
                title="Toggle Status Bar Translucent"
                onPress={() => setStatusBarTranslucent((v) => !v)}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
      <Modal isVisible={isModalVisible} coverScreen={false}>
        <View style={styles.modalContainer}>
          <Text>
            Property "coverScreen" set to "false" does the trick and notification should be rendered
            above the modal!
          </Text>

          <Button
            title="Show notification"
            onPress={() =>
              Notifier.showNotification({
                title: 'Hello react-native-modal!',
                description: 'Modal + Notifier = ❤️',
              })
            }
          />
          <Button title="Hide modal" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <NotifierRoot ref={notifierRef} translucentStatusBar={statusBarTranslucent} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 25,
    maxHeight: 500,
    paddingHorizontal: 30,
  },
});
