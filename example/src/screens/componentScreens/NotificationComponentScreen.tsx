import { Notifier, NotifierComponents } from 'react-native-notifier';
import Button from '../../components/Button';
import { ScrollView } from 'react-native';

export const NotificationComponentScreen = () => {
  return (
    <ScrollView>
      <Button
        title="Successful"
        onPress={() =>
          Notifier.showNotification({
            title: 'Operation Successful!',
            description: 'Everything went smoothly.',
            Component: NotifierComponents.Notification,
            componentProps: {
              type: 'success',
            },
          })
        }
      />
      <Button
        title="Warning"
        onPress={() =>
          Notifier.showNotification({
            title: 'Something is missing...',
            description: 'Please fill out all required fields.',
            Component: NotifierComponents.Notification,
            componentProps: {
              type: 'warn',
            },
          })
        }
      />
      <Button
        title="Info"
        onPress={() =>
          Notifier.showNotification({
            title: 'Please check your inbox.',
            description: 'Your new credentials are active.',
            Component: NotifierComponents.Notification,
            componentProps: {
              type: 'info',
            },
          })
        }
      />
      <Button
        title="Error"
        onPress={() =>
          Notifier.showNotification({
            title: 'Oops!',
            description: 'Something went wrong.',
            Component: NotifierComponents.Notification,
            componentProps: {
              type: 'error',
            },
          })
        }
      />
      <Button
        title="No Internet"
        onPress={() =>
          Notifier.showNotification({
            title: "You're offline now",
            description: 'Opps! Internet is disconnected',
            Component: NotifierComponents.Notification,
            duration: 0,
            componentProps: {
              type: 'disconnected',
            },
          })
        }
      />
      <Button
        title="Internet Connected"
        onPress={() =>
          Notifier.showNotification({
            title: "You're online now",
            description: 'Hurray! Internet is connected',
            Component: NotifierComponents.Notification,
            componentProps: {
              type: 'connected',
            },
          })
        }
      />
      <Button
        title="Message"
        onPress={() =>
          Notifier.showNotification({
            title: 'John Doe',
            description: 'Hello! Can you help me with notifications?',
          })
        }
      />
      <Button
        title="Long message"
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
            componentProps: {
              imageSource: require('../../react.jpg'),
            },
          })
        }
      />
    </ScrollView>
  );
};
