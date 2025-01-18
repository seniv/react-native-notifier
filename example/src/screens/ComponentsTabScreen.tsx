import { ScrollView } from 'react-native';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import Button from '../components/Button';

export const ComponentsTabScreen = () => {
  return (
    <ScrollView>
      <Button
        title="Toast: Successful"
        onPress={() =>
          Notifier.showNotification({
            title: 'Operation Successful!',
            description: 'Everything went smoothly.',
            Component: NotifierComponents.Toast,
            componentProps: {
              type: 'success',
            },
          })
        }
      />
      <Button
        title="Toast: Warning"
        onPress={() =>
          Notifier.showNotification({
            title: 'Something is missing...',
            description: 'Please fill out all required fields.',
            Component: NotifierComponents.Toast,
            componentProps: {
              type: 'warn',
            },
          })
        }
      />
      <Button
        title="Toast: Info"
        onPress={() =>
          Notifier.showNotification({
            title: 'Please check your inbox.',
            description: 'Your new credentials are active.',
            Component: NotifierComponents.Toast,
            componentProps: {
              type: 'info',
            },
          })
        }
      />
      <Button
        title="Toast: Error"
        onPress={() =>
          Notifier.showNotification({
            title: 'Oops!',
            description: 'Something went wrong.',
            Component: NotifierComponents.Toast,
            componentProps: {
              type: 'error',
            },
          })
        }
      />
      <Button
        title="Toast: No Internet"
        onPress={() =>
          Notifier.showNotification({
            title: "You're offline now",
            description: 'Opps! Internet is disconnected',
            Component: NotifierComponents.Toast,
            duration: 0,
            componentProps: {
              type: 'disconnected',
            },
          })
        }
      />
      <Button
        title="Toast: Internet Connected"
        onPress={() =>
          Notifier.showNotification({
            title: "You're online now",
            description: 'Hurray! Internet is connected',
            Component: NotifierComponents.Toast,
            componentProps: {
              type: 'connected',
            },
          })
        }
      />
      <Button
        title="SimpleToast"
        onPress={() =>
          Notifier.showNotification({
            title: 'Copied to clipboard!',
            Component: NotifierComponents.SimpleToast,
          })
        }
      />
      <Button
        title="Notification: message"
        onPress={() =>
          Notifier.showNotification({
            title: 'John Doe',
            description: 'Hello! Can you help me with notifications?',
          })
        }
      />
      <Button
        title="Notification: long message"
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
        title="Notification: With Image"
        onPress={() =>
          Notifier.showNotification({
            title: 'Check this image!',
            description: 'Cool, right?',
            componentProps: {
              imageSource: require('../react.jpg'),
            },
          })
        }
      />
      <Button
        title="Alert: Success"
        onPress={() =>
          Notifier.showNotification({
            title: 'Your profile was successfully saved!',
            Component: NotifierComponents.Alert,
            componentProps: {
              type: 'success',
            },
          })
        }
      />
      <Button
        title="Alert: Error"
        onPress={() =>
          Notifier.showNotification({
            title: 'The request has failed',
            description: 'Please, check your internet connection',
            Component: NotifierComponents.Alert,
            componentProps: {
              type: 'error',
            },
          })
        }
      />
    </ScrollView>
  );
};
