import { Notifier } from 'react-native-notifier';
import Button from '../components/Button';
import { isIos } from '../constants';
import { useAppStore } from '../store';

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
      {isIos && (
        <Button
          title="Toggle useRNScreensOverlay"
          onPress={toggleUseRNScreensOverlay}
        />
      )}
    </>
  );
};
