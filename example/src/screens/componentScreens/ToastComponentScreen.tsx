import { Notifier, NotifierComponents } from 'react-native-notifier';
import Button from '../../components/Button';
import { ScrollView } from 'react-native';

export const ToastComponentScreen = () => {
  return (
    <ScrollView>
      <Button
        title="Successful"
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
        title="Warning"
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
        title="Info"
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
        title="Error"
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
        title="No Internet"
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
        title="Internet Connected"
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
    </ScrollView>
  );
};
