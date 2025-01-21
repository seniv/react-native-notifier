import { Notifier, NotifierComponents } from 'react-native-notifier';
import Button from '../../components/Button';
import { ScrollView } from 'react-native';

export const AlertComponentScreen = () => {
  return (
    <ScrollView>
      <Button
        title="Success"
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
        title="Error"
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
      <Button
        title="Info"
        onPress={() =>
          Notifier.showNotification({
            title: 'Please check your inbox.',
            description: 'Your new credentials are active.',
            Component: NotifierComponents.Alert,
            componentProps: {
              type: 'info',
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
            Component: NotifierComponents.Alert,
            componentProps: {
              type: 'warn',
            },
          })
        }
      />
    </ScrollView>
  );
};
