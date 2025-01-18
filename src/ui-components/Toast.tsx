import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  type TextStyle,
  type ViewStyle,
  type StyleProp,
  type ImageSourcePropType,
  type ImageStyle,
} from 'react-native';
import type { NotifierComponentProps } from '../types';

type Types =
  | 'error'
  | 'warn'
  | 'info'
  | 'success'
  | 'connected'
  | 'disconnected';

const iconColors: Record<Types, string> = {
  warn: '#FD9F02',
  error: '#F34F4E',
  info: '#3150EC',
  success: '#24BF60',
  connected: '#24BF60',
  disconnected: '#CCCCCC',
};

const backgroundColors: Record<Types, string> = {
  warn: '#FFF6E5',
  error: '#FFF2F2',
  info: '#F3F3FF',
  success: '#E7F8F0',
  connected: '#E7F8F0',
  disconnected: '#F2F2F2',
};

const icons: Record<Types, ImageSourcePropType> = {
  warn: require('./icons/warn.png'),
  error: require('./icons/error.png'),
  success: require('./icons/success.png'),
  info: require('./icons/info.png'),
  connected: require('./icons/connected.png'),
  disconnected: require('./icons/disconnected.png'),
};

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  contentContainer: {
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 33,
    paddingVertical: 8,
    paddingRight: 20,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 10,
  },
  contentContainerNoIcon: {
    paddingLeft: 20,
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
    lineHeight: 20,
    color: '#45516F',
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    color: '#6D7686',
  },
});

export interface ToastProps extends NotifierComponentProps {
  /** If set, the icon and icon background color will be determined by the provided type.
   * @default null */
  type?: Types;

  /** When `true`, the title color is automatically derived from the `type` prop.
   * @default false */
  useTypeColorForTitle?: boolean;

  /** When `true`, the description color is automatically derived from the `type` prop.
   * @default false */
  useTypeColorForDescription?: boolean;

  /** The maximum number of lines for rendering the title text.
   * @default null */
  maxTitleLines?: number;

  /** The maximum number of lines for rendering the description text.
   * @default null */
  maxDescriptionLines?: number;

  /** The icon source passed to the `<Image />` component as the `source` prop.
   * If not specified, a default icon is used based on the `type`.
   * @default depends on `type`
   * @example iconSource: require('./icons/success.png') */
  iconSource?: ImageSourcePropType;

  /** Style for the outermost container of the toast.
   * @default null */
  containerStyle?: StyleProp<ViewStyle>;

  /** Style for the toast content container, often used to modify background color,
   * shadows, padding, or margin.
   * @default null */
  contentContainerStyle?: StyleProp<ViewStyle>;

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

  /** A custom container component. If used, it replaces the default `ViewWithOffsets` provided by the library.
   * @default ViewWithOffsets */
  ContainerComponent?: React.ElementType;
}

export const ToastComponent = ({
  title,
  description,
  type,
  useTypeColorForTitle,
  useTypeColorForDescription,
  maxTitleLines,
  maxDescriptionLines,
  iconSource,
  containerStyle,
  contentContainerStyle,
  iconContainerStyle,
  iconStyle,
  textContainerStyle,
  titleStyle,
  descriptionStyle,
  ContainerComponent,
  ViewWithOffsets,
}: ToastProps) => {
  const Container = ContainerComponent ?? ViewWithOffsets;
  return (
    <Container style={[s.container, containerStyle]}>
      <View
        style={[
          s.contentContainer,
          !type && !iconSource && s.contentContainerNoIcon,
          contentContainerStyle,
        ]}
      >
        {(!!type || !!iconSource) && (
          <View
            style={[
              s.iconBackground,
              type && {
                backgroundColor: backgroundColors[type],
              },
              iconContainerStyle,
            ]}
          >
            <Image
              style={[
                s.icon,
                type === 'warn' && s.warnIcon,
                type && {
                  tintColor: iconColors[type],
                },
                iconStyle,
              ]}
              source={iconSource ?? (type ? icons[type] : undefined)}
            />
          </View>
        )}
        <View style={[s.textContainer, textContainerStyle]}>
          {!!title && (
            <Text
              style={[
                s.title,
                titleStyle,
                type && useTypeColorForTitle && { color: iconColors[type] },
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
                type &&
                  useTypeColorForDescription && { color: iconColors[type] },
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
