import { Notifier, NotifierComponents } from 'react-native-notifier';
import Button from '../components/Button';
import { ScrollView, StyleSheet, TextInput } from 'react-native';

const styles = StyleSheet.create({
  input: {
    marginTop: 16,
    marginHorizontal: 10,
    borderRadius: 5,
    borderColor: 'silver',
    borderWidth: 1,
    padding: 8,
  },
});

export const PositionsTabScreen = () => {
  return (
    <ScrollView>
      <Button
        title="Top"
        onPress={() =>
          Notifier.showNotification({
            title: 'Top Position',
            description: 'Default notification position',
            componentProps: {
              type: 'info',
            },
          })
        }
      />
      <Button
        title="Bottom"
        onPress={() =>
          Notifier.showNotification({
            title: 'Bottom Position',
            description: 'Moved to the bottom using position parameter',
            position: 'bottom',
            duration: 5000,
            additionalOffsets: { bottom: 45 },
            Component: NotifierComponents.Toast,
            componentProps: {
              type: 'info',
            },
          })
        }
      />
      <Button
        title="Top Left"
        onPress={() =>
          Notifier.showNotification({
            title: 'Top Left Position',
            description:
              'Moved to the top left corner using position parameter',
            position: 'topLeft',
            Component: NotifierComponents.Toast,
            componentProps: {
              type: 'info',
            },
          })
        }
      />
      <Button
        title="Top Right"
        onPress={() =>
          Notifier.showNotification({
            title: 'Top Right Position',
            description:
              'Moved to the top right corner using position parameter',
            position: 'topRight',
            Component: NotifierComponents.Toast,
            componentProps: {
              type: 'info',
            },
          })
        }
      />
      <Button
        title="Bottom Left"
        onPress={() =>
          Notifier.showNotification({
            title: 'Bottom Left Position',
            description:
              'Moved to the bottom left corner using position parameter',
            position: 'bottomLeft',
            Component: NotifierComponents.Toast,
            componentProps: {
              type: 'info',
            },
          })
        }
      />
      <Button
        title="Bottom Right"
        onPress={() =>
          Notifier.showNotification({
            title: 'Bottom Right Position',
            description:
              'Moved to the bottom right corner using position parameter',
            position: 'bottomRight',
            Component: NotifierComponents.Toast,
            componentProps: {
              type: 'info',
            },
          })
        }
      />
      <TextInput style={styles.input} placeholder="Press to open keyboard" />
    </ScrollView>
  );
};
