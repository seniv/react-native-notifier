import { StyleSheet, View, Text } from 'react-native';
import type { NotifierComponentProps } from 'react-native-notifier';

const customStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'orange',
  },
  container: {
    padding: 20,
  },
  title: { color: 'white', fontWeight: 'bold' },
  description: { color: 'white' },
});

const CustomComponent = ({
  title,
  description,
  ViewWithOffsets,
}: NotifierComponentProps) => (
  <ViewWithOffsets style={customStyles.safeArea}>
    <View style={customStyles.container}>
      <Text style={customStyles.title}>{title}</Text>
      <Text style={customStyles.description}>{description}</Text>
    </View>
  </ViewWithOffsets>
);

export default CustomComponent;
