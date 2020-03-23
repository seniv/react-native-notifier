import * as React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

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
  <SafeAreaView style={customStyles.safeArea}>
    <View style={customStyles.container}>
      <Text style={customStyles.title}>{title}</Text>
      <Text style={customStyles.description}>{description}</Text>
    </View>
  </SafeAreaView>
);

export default CustomComponent;
