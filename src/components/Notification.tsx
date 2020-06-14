import React from 'react';
import { StyleSheet, View, Text, ImageSourcePropType, Image, TextStyle } from 'react-native';

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

export interface NotificationComponentProps {
  /** Passed to `<Image />` as `source` param.
   * @default null */
  imageSource?: ImageSourcePropType;

  /** The maximum number of lines to use for rendering title.
   * @default null */
  maxTitleLines?: number;

  /** The maximum number of lines to use for rendering description.
   * @default null */
  maxDescriptionLines?: number;

  /** A container of the component. Set it in case you use different SafeAreaView than the standard
   * @default SafeAreaView */
  ContainerComponent?: Function;

  /** The style to use for rendering title
   * @default null */
  titleStyle?: TextStyle;
}

interface NotificationComponentAllProps extends NotificationComponentProps {
  title?: string;
  description?: string;
}

const NotificationComponent: React.FunctionComponent<NotificationComponentAllProps> = ({
  title,
  titleStyle,
  description,
  imageSource,
  ContainerComponent,
  maxTitleLines,
  maxDescriptionLines,
}) => {
  const Container = ContainerComponent ?? SafeContainer;
  return (
    <Container>
      <View style={s.container}>
        {!!imageSource && <Image style={s.image} source={imageSource} />}
        <View style={s.content}>
          {!!title && (
            <Text style={[s.title, titleStyle]} numberOfLines={maxTitleLines}>
              {title}
            </Text>
          )}
          {!!description && (
            <Text style={s.description} numberOfLines={maxDescriptionLines}>
              {description}
            </Text>
          )}
        </View>
      </View>
    </Container>
  );
};

export default NotificationComponent;
