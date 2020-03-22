import * as React from 'react';
import {
  StyleSheet,
  View,
  Button as RNButton,
  StatusBar,
  Platform,
  ButtonProps,
  Text,
  SafeAreaView,
} from 'react-native';
import { Easing, Notifier, NotifierRoot } from 'react-native-notifier';

const Button = (props: ButtonProps) => (
  <View style={styles.button}>
    <RNButton {...props} />
  </View>
);

const customStyles = StyleSheet.create({
  safeArea: { backgroundColor: 'orange', padding: 20 },
  container: {
    padding: 20,
  },
  title: { color: 'white', fontWeight: 'bold' },
  description: { color: 'white' },
});
interface CustomComponentProps {
  title?: string;
  description?: string;
}
const CustomComponent = ({ title, description }: CustomComponentProps) => (
  <SafeAreaView style={customStyles.safeArea}>
    <View style={customStyles.container}>
      <Text style={customStyles.title}>{title}</Text>
      <Text style={customStyles.description}>{description}</Text>
    </View>
  </SafeAreaView>
);

const isAndroid = Platform.OS === 'android';

export default function App() {
  const notifierRef = React.useRef<NotifierRoot>(null);
  const [statusBar, setStatusBar] = React.useState(true);
  const [statusBarTranslucent, setStatusBarTranslucent] = React.useState(false);

  if (isAndroid) {
    StatusBar.setHidden(statusBar);
    StatusBar.setTranslucent(statusBarTranslucent);
  }

  return (
    <View style={styles.container}>
      <Button
        title="showEasing: Easing.bounce"
        onPress={() =>
          Notifier.showNotification({
            title: 'John Doe',
            description: 'Hello! Can you help me with notifications?',
            duration: 0,
            showAnimationDuration: 800,
            showEasing: Easing.bounce,
            hideEasing: Easing.circle,

            onHide: () => console.log('onHide'),
            onPress: () => console.log('press'),
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
        title="Without Description"
        onPress={() =>
          Notifier.showNotification({
            title: 'Here some very useful information',
          })
        }
      />
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
      {isAndroid && (
        <>
          <Button title="Toggle Status Bar" onPress={() => setStatusBar(v => !v)} />
          <Button
            title="Toggle Status Bar Translucent"
            onPress={() => setStatusBarTranslucent(v => !v)}
          />
        </>
      )}
      <NotifierRoot ref={notifierRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    flex: 1,
    paddingTop: 260,
  },
  button: {
    marginTop: isAndroid ? 10 : 0,
  },
});
