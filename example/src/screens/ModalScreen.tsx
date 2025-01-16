import {
  Notifier,
  NotifierComponents,
  NotifierRoot,
} from 'react-native-notifier';
import Button from '../components/Button';
import { isIos } from '../constants';
import { useAppStore } from '../store';
import { View } from 'react-native';

export const ModalScreen = () => {
  const useRNScreensOverlay = useAppStore((state) => state.useRNScreensOverlay);
  const toggleUseRNScreensOverlay = useAppStore(
    (state) => state.toggleUseRNScreensOverlay
  );

  return (
    <>
      <Button
        title="Show Notification"
        onPress={() =>
          Notifier.showNotification({
            title: 'Notification above modal',
            description: `Currently useRNScreensOverlay is ${useRNScreensOverlay ? 'enabled' : 'disabled'}`,
          })
        }
      />
      <Button
        title="Broadcast Show Notification"
        onPress={() =>
          Notifier.broadcast.showNotification({
            title: 'Notification above modal',
            description: `Currently useRNScreensOverlay is ${useRNScreensOverlay ? 'enabled' : 'disabled'}`,
            Component: NotifierComponents.Alert,
          })
        }
      />
      {isIos && (
        <Button
          title="Toggle useRNScreensOverlay"
          onPress={toggleUseRNScreensOverlay}
        />
      )}
      <NotifierRoot
        Component={NotifierComponents.Alert}
        componentProps={{ ContainerComponent: View }}
        duration={10000}
      />
    </>
  );
};
