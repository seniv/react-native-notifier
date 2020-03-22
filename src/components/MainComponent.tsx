import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

const s = StyleSheet.create({
  container: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 10,

    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 25,
    color: '#007BFF',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444444',
  },
});

interface MainComponentProps {
  title?: string;
  description?: string;
}

const MainComponent: React.FunctionComponent<MainComponentProps> = ({ title, description }) => {
  return (
    <SafeAreaView>
      <View style={s.container}>
        {!!title && <Text style={s.title}>{title}</Text>}
        {!!description && <Text style={s.description}>{description}</Text>}
      </View>
    </SafeAreaView>
  );
};

export default MainComponent;
