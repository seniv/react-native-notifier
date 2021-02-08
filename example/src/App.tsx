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

const isAndroid = Platform.OS === 'android';

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
          <Button title="Hide" onPress={() => Notifier.hideNotification()} />
          <Button title="Open react-native-modal" onPress={() => setModalVisible(true)} />
          {isAndroid && (
            <>
              <Button title="Toggle Status Bar" onPress={() => setStatusBar(v => !v)} />
              <Button
                title="Toggle Status Bar Translucent"
                onPress={() => setStatusBarTranslucent(v => !v)}
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
      <NotifierRoot ref={notifierRef} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 100,
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
