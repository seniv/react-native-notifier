import { Notifier, NotifierComponents } from 'react-native-notifier';
import Button from '../../components/Button';
import { ScrollView } from 'react-native';

export const SimpleToastComponentScreen = () => {
  return (
    <ScrollView>
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
        title="SimpleToast at bottom"
        onPress={() =>
          Notifier.showNotification({
            title: 'Copied to clipboard!',
            Component: NotifierComponents.SimpleToast,
            position: 'bottom',
          })
        }
      />
    </ScrollView>
  );
};
