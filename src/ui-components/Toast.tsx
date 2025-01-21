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
import type { InternalNotifierComponentProps } from '../types';
import {
  backgroundColors,
  commonStyles,
  iconColors,
  icons,
  type Types,
} from './common';

const s = StyleSheet.create({
  safeArea: {
    alignItems: 'center',
  },
  container: {
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 33,
    paddingVertical: 8,
    paddingRight: 20,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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

export interface ToastProps extends InternalNotifierComponentProps {
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

  /** Style for the safe area container of the toast.
   * @default null */
  safeAreaStyle?: StyleProp<ViewStyle>;

  /** Style for the toast content container, often used to modify background color,
   * shadows, padding, or margin.
   * @default null */
  containerStyle?: StyleProp<ViewStyle>;

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
  safeAreaStyle,
  containerStyle,
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
    <Container style={[s.safeArea, safeAreaStyle]}>
      <View
        style={[
          s.container,
          commonStyles.shadow,
          !type && !iconSource && s.contentContainerNoIcon,
          containerStyle,
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
                type && useTypeColorForTitle && { color: iconColors[type] },
                titleStyle,
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
                type &&
                  useTypeColorForDescription && { color: iconColors[type] },
                descriptionStyle,
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
