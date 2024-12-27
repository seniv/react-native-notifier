import { Notifier } from 'react-native-notifier/next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useAppStore } from '../store';
import { isIos } from '../constants';

export const ModalsTabScreen = () => {
  const navigation = useNavigation<any>();
  const [isModalVisible, setModalVisible] = useState(false);
  const useRNScreensOverlay = useAppStore((state) => state.useRNScreensOverlay);
  const toggleUseRNScreensOverlay = useAppStore(
    (state) => state.toggleUseRNScreensOverlay
  );

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
