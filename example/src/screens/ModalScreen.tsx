import { Notifier } from 'react-native-notifier';
import Button from '../components/Button';

export const ModalScreen = () => {
  return (
    <>
      <Button
        title="Show Regular Notification"
        onPress={() =>
          Notifier.showNotification({
            title: 'Notification above modal',
            description: 'without useRNScreensOverlay',
            useRNScreensOverlay: false,
          })
        }
      />
      <Button
        title="Show Notification with useRNScreensOverlay"
        onPress={() =>
          Notifier.showNotification({
            title: 'Notification above modal',
            description: 'Native Stack Modal should be below the notification',
            useRNScreensOverlay: true,
          })
        }
      />
    </>
  );
};
