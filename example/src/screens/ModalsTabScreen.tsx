import { Notifier } from 'react-native-notifier';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

export const ModalsTabScreen = () => {
  const navigation = useNavigation<any>();
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <>
      <ScrollView>
        <Button
          title="Open react-native-modal"
          onPress={() => setModalVisible(true)}
        />
        <Button
          title="Open native-stack modal"
          onPress={() => navigation.navigate('Modal')}
        />
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
              description: 'with useRNScreensOverlay',
              useRNScreensOverlay: true,
            })
          }
        />
      </ScrollView>
      <Modal isVisible={isModalVisible} coverScreen={false}>
        <View style={styles.modalContainer}>
          <Text>
            Property "coverScreen" set to "false" does the trick and
            notification should be rendered above the modal!
          </Text>

          <Button
            title="Show notification"
            onPress={() =>
              Notifier.showNotification({
                title: 'Hello react-native-modal!',
                description: 'Modal + Notifier = ❤️',
              })
            }
          />
          <Button title="Hide modal" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 25,
    maxHeight: 500,
    paddingHorizontal: 30,
  },
});
