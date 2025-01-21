import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  NotifierComponents,
  type ViewWithOffsetsComponent,
} from 'react-native-notifier';
import { useNavigation } from '@react-navigation/native';

const style = StyleSheet.create({
  gap: {
    gap: 16,
  },
});

const DummyViewWithOffsets: ViewWithOffsetsComponent = (props) => (
  <View {...props} />
);

export const ComponentsTabScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <ScrollView>
      <View style={style.gap}>
        <TouchableOpacity onPress={() => navigation.push('AlertComponent')}>
          <NotifierComponents.Alert
            ViewWithOffsets={DummyViewWithOffsets}
            type="success"
            title="Alert"
            description="Component"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.push('NotificationComponent')}
        >
          <NotifierComponents.Notification
            ViewWithOffsets={DummyViewWithOffsets}
            type="success"
            title="Notification"
            description="Component"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.push('ToastComponent')}>
          <NotifierComponents.Toast
            ViewWithOffsets={DummyViewWithOffsets}
            type="success"
            title="Toast"
            description="Component"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.push('SimpleToastComponent')}
        >
          <NotifierComponents.SimpleToast
            ViewWithOffsets={DummyViewWithOffsets}
            title="SimpleToast"
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
