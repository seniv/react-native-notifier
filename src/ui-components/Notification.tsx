import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  type ImageSourcePropType,
  type TextStyle,
  type ImageStyle,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import type { NotifierComponentProps } from '../types';
import {
  backgroundColors,
  commonStyles,
  iconColors,
  icons,
  type Types,
} from './common';

const s = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  borderWidth: {
    borderLeftWidth: 4,
  },
  containerWithIcon: {
    paddingLeft: 10,
  },
  image: {
    alignItems: 'center',
    borderRadius: 8,
    height: 45,
    width: 45,
  },
  iconBackground: {
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    width: 35,
    height: 35,
  },
  warnIcon: {
    top: -2,
  },
  textContainer: {
    flexShrink: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 25,
    color: '#45516F',
  },
  classicTitle: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    color: '#6D7686',
  },
  classicDescription: {
    color: '#444444',
  },
});

export interface NotificationComponentProps extends NotifierComponentProps {
  /** If set, the icon, icon background color, and border color will be determined by the provided type.
   * - classic - uses the same style as it was in v2 and lower
   * - other value - adds icon, and border on the left side
   * @default null */
  type?: Types | 'classic';

  /** When `true`, the title color is automatically derived from the `type` prop.
   * @default false */
  useTypeColorForTitle?: boolean;

  /** When `true`, the description color is automatically derived from the `type` prop.
   * @default false */
  useTypeColorForDescription?: boolean;

  /** Passed to `<Image />` as `source` param.
   * @default null */
  imageSource?: ImageSourcePropType;

  /** The maximum number of lines for rendering the title text.
   * @default null */
  maxTitleLines?: number;

  /** The maximum number of lines for rendering the description text.
   * @default null */
  maxDescriptionLines?: number;

  /** A custom container component. If used, it replaces the default `ViewWithOffsets` provided by the library.
   * @default ViewWithOffsets */
  ContainerComponent?: React.ElementType;

  /** The icon source passed to the `<Image />` component as the `source` prop.
   * If not specified, a default icon is used based on the `type`.
   * @default depends on `type`
   * @example iconSource: require('./icons/success.png') */
  iconSource?: ImageSourcePropType;

  /** Style for the outermost container of the toast.
   * @default null */
  safeAreaStyle?: StyleProp<ViewStyle>;

  /** Style for the icon container, useful for adjusting background color or size.
   * @default null */
  iconContainerStyle?: StyleProp<TextStyle>;

  /** Style for the icon `<Image />` itself, useful for adjusting icon color or size.
   * @default null
   * @example { tintColor: 'red' } */
  iconStyle?: StyleProp<ImageStyle>;

  /** Style for the text container wrapping both title and description.
   * @default null */
  textContainerStyle?: StyleProp<TextStyle>;

  /** Style for the title text.
   * @default null */
  titleStyle?: StyleProp<TextStyle>;

  /** Style for the description text.
   * @default null */
  descriptionStyle?: StyleProp<TextStyle>;

  /** Style for the toast content container, often used to modify background color,
   * shadows, padding, or margin.
   * @default null */
  containerStyle?: StyleProp<ViewStyle>;

  /** The style to use for rendering image
   * @default null */
  imageStyle?: StyleProp<ImageStyle>;
}

export const NotificationComponent = ({
  title,
  titleStyle,
  description,
  descriptionStyle,
  imageSource,
  imageStyle,
  ContainerComponent,
  maxTitleLines,
  maxDescriptionLines,
  containerStyle,
  type = 'classic',
  useTypeColorForTitle,
  useTypeColorForDescription,
  iconSource,
  safeAreaStyle,
  iconContainerStyle,
  iconStyle,
  textContainerStyle,
  ViewWithOffsets,
}: NotificationComponentProps) => {
  const Container = ContainerComponent ?? ViewWithOffsets;
  return (
    <Container style={safeAreaStyle}>
      <View
        style={[
          s.container,
          commonStyles.shadow,
          (type !== 'classic' || !!imageSource || !!iconSource) &&
            s.containerWithIcon,
          type !== 'classic' && s.borderWidth,
          type !== 'classic' && { borderColor: iconColors[type] },
          containerStyle,
        ]}
      >
        {!!imageSource && (
          <Image style={[s.image, imageStyle]} source={imageSource} />
        )}
        {(type !== 'classic' || !!iconSource) && (
          <View
            style={[
              s.iconBackground,
              type !== 'classic' && {
                backgroundColor: backgroundColors[type],
              },
              iconContainerStyle,
            ]}
          >
            <Image
              style={[
                s.icon,
                type === 'warn' && s.warnIcon,
                type !== 'classic' && {
                  tintColor: iconColors[type],
                },
                iconStyle,
              ]}
              source={
                iconSource ?? (type !== 'classic' ? icons[type] : undefined)
              }
            />
          </View>
        )}
        <View style={[s.textContainer, textContainerStyle]}>
          {!!title && (
            <Text
              style={[
                s.title,
                titleStyle,
                type !== 'classic' &&
                  useTypeColorForTitle && { color: iconColors[type] },
                type === 'classic' && s.classicTitle,
              ]}
              numberOfLines={maxTitleLines}
            >
              {title}
            </Text>
          )}
          {!!description && (
            <Text
              style={[
                s.description,
                descriptionStyle,
                type !== 'classic' &&
                  useTypeColorForDescription && { color: iconColors[type] },
                type === 'classic' && s.classicDescription,
              ]}
              numberOfLines={maxDescriptionLines}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
    </Container>
  );
};
