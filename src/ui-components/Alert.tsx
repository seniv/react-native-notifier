import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import type { InternalNotifierComponentProps } from '../types';

type AlertTypes = 'error' | 'warn' | 'info' | 'success';

const bgColors: Record<AlertTypes, string> = {
  error: '#E03737',
  warn: '#FFAC00',
  info: '#007BFF',
  success: '#00B104',
};

const s = StyleSheet.create({
  container: {
    margin: 10,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    color: 'white',
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    color: 'white',
  },
});

export interface AlertComponentProps extends InternalNotifierComponentProps {
  /** Background color will be changed depending on the type. Available values: `error`(red), `success`(green), `warn`(orange) and `info`(blue).
   * @default 'success' */
  type: AlertTypes;

  /**
   * @deprecated use `type` instead
   */
  alertType?: AlertTypes;

  /** While the background of the alert depends on `type`, you can also set the other color you want.
   * @default null */
  backgroundColor?: string;

  /** Color of `title` and `description`.
   * @default 'white' */
  textColor?: string;

  /** The maximum number of lines to use for rendering title.
   * @default null */
  maxTitleLines?: number;

  /** The maximum number of lines to use for rendering description.
   * @default null */
  maxDescriptionLines?: number;

  /** A container of the component. Set it in case you use different SafeAreaView than the custom `ViewWithOffsets`
   * @default ViewWithOffsets */
  ContainerComponent?: React.ElementType;

  /** The style to use for rendering title
   * @default null */
  titleStyle?: StyleProp<TextStyle>;

  /** The style to use for rendering description
   * @default null */
  descriptionStyle?: StyleProp<TextStyle>;
}

export const AlertComponent = ({
  title,
  titleStyle,
  description,
  descriptionStyle,
  type = 'success',
  alertType = 'success',
  backgroundColor,
  textColor,
  ContainerComponent,
  maxTitleLines,
  maxDescriptionLines,
  ViewWithOffsets,
}: AlertComponentProps) => {
  const Container = ContainerComponent ?? ViewWithOffsets;
  const textStyle = textColor ? { color: textColor } : null;
  return (
    <Container
      style={{
        backgroundColor: backgroundColor || bgColors[type ?? alertType],
      }}
    >
      <View style={s.container}>
        {!!title && (
          <Text
            style={[s.title, textStyle, titleStyle]}
            numberOfLines={maxTitleLines}
          >
            {title}
          </Text>
        )}
        {!!description && (
          <Text
            style={[s.description, textStyle, descriptionStyle]}
            numberOfLines={maxDescriptionLines}
          >
            {description}
          </Text>
        )}
      </View>
    </Container>
  );
};
