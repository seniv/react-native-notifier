import { StyleSheet, View, Text } from 'react-native';
import { NotifierComponents } from 'react-native-notifier/next';

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

interface CustomComponentProps {
  title?: string;
  description?: string;
}

const CustomComponent = ({ title, description }: CustomComponentProps) => (
  <NotifierComponents.SafeAreaInsetsView style={customStyles.safeArea}>
    <View style={customStyles.container}>
      <Text style={customStyles.title}>{title}</Text>
      <Text style={customStyles.description}>{description}</Text>
    </View>
  </NotifierComponents.SafeAreaInsetsView>
);

export default CustomComponent;
