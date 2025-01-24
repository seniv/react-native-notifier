import { StyleSheet, View, Text } from 'react-native';
import type { NotifierComponentProps } from 'react-native-notifier';

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'orange',
  },
  container: {
    padding: 20,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  description: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
});

interface CustomComponentProps extends NotifierComponentProps {
  extraInfo?: string;
}

const CustomComponent = ({
  title,
  description,
  ViewWithOffsets,
  extraInfo,
}: CustomComponentProps) => (
  <ViewWithOffsets style={styles.safeArea}>
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {!!extraInfo && <Text style={{ color: 'white' }}>{extraInfo}</Text>}
    </View>
  </ViewWithOffsets>
);

export default CustomComponent;
