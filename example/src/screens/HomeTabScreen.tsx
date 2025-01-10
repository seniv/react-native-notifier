import { ScrollView } from 'react-native';
import {
  Easing,
  Notifier,
  NotifierComponents,
} from 'react-native-notifier/next';
import Button from '../components/Button';
import CustomComponent from '../components/CustomComponent';

import { isAndroid, notifierRef } from '../constants';
import { useAppStore } from '../store';

export const HomeTabScreen = () => {
  const toggleStatusBar = useAppStore((state) => state.toggleStatusBar);
  const toggleStatusBarTranslucent = useAppStore(
    (state) => state.toggleStatusBarTranslucent
  );

  return (
    <ScrollView>
      <Button
        title="Easing: bounce"
        onPress={() =>
          Notifier.showNotification({
            title: 'John Doe',
            description: 'Hello! Can you help me with notifications?',
            duration: 0,
            showAnimationConfig: {
              method: 'timing',
              config: {
                duration: 800,
                easing: Easing.bounce,
              },
            },
            hideAnimationConfig: {
              method: 'timing',
              config: {
                easing: Easing.circle,
              },
            },

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
            title: 'Lorem?',
            duration: 6000,
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
              imageSource: require('../react.jpg'),
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
      <Button
        title="Clear Queue and Hide"
        onPress={() => Notifier.clearQueue(true)}
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
      <Button
        title="Slow animation & onShown"
        onPress={() =>
          notifierRef.current?.showNotification({
            title: 'Called using ref!',
            description: 'Amazing!',
            showAnimationConfig: {
              method: 'timing',
              config: {
                duration: 5000,
              },
            },
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
      <Button title="Hide" onPress={() => Notifier.hideNotification()} />
      {isAndroid && (
        <>
          <Button title="Toggle Status Bar" onPress={toggleStatusBar} />
          <Button
            title="Toggle Status Bar Translucent"
            onPress={toggleStatusBarTranslucent}
          />
        </>
      )}
    </ScrollView>
  );
};
