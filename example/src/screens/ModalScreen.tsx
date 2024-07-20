import { Notifier } from 'react-native-notifier';
import Button from '../components/Button';

export const ModalScreen = () => {
  return (
    <Button
      title="Show Notification"
      onPress={() =>
        Notifier.showNotification({
          title: 'Notification above modal',
          description: 'Native Stack Modal should be below the notification',
        })
      }
    />
  );
};
