import React from 'react';
import { StyleSheet, View, Text, ImageSourcePropType, Image } from 'react-native';

import SafeContainer from './SafeContainer';

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
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    alignItems: 'center',
    marginRight: 5,
    borderRadius: 5,
    height: 45,
    width: 45,
  },
  content: {
    flex: 1,
    marginHorizontal: 5,
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
  imageSource?: ImageSourcePropType;
  ContainerComponent?: Function;
}

const MainComponent: React.FunctionComponent<MainComponentProps> = ({
  title,
  description,
  imageSource,
  ContainerComponent,
}) => {
  const Container = ContainerComponent ?? SafeContainer;
  return (
    <Container>
      <View style={s.container}>
        {!!imageSource && <Image style={s.image} source={imageSource} />}
        <View style={s.content}>
          {!!title && <Text style={s.title}>{title}</Text>}
          {!!description && <Text style={s.description}>{description}</Text>}
        </View>
      </View>
    </Container>
  );
};

export default MainComponent;
