import React from 'react';
import { StyleSheet, View, Text, TextStyle, StyleProp } from 'react-native';

import SafeContainer from './SafeContainer';

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

export interface AlertComponentProps {
  /** Background color will be changed depending on the type. Available values: `error`(red), `success`(green), `warn`(orange) and `info`(blue).
   * @default 'success' */
  alertType: AlertTypes;

  /** While the background of the alert depends on `alertType`, you can also set the other color you want.
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

  /** A container of the component. Set it in case you use different SafeAreaView than the standard
   * @default SafeAreaView */
  ContainerComponent?: React.ElementType;

  /** The style to use for rendering title
   * @default null */
  titleStyle?: StyleProp<TextStyle>;

  /** The style to use for rendering description
   * @default null */
  descriptionStyle?: StyleProp<TextStyle>;
}

interface AlertComponentAllProps extends AlertComponentProps {
  title?: string;
  description?: string;
}

const AlertComponent: React.FunctionComponent<AlertComponentAllProps> = ({
  title,
  titleStyle,
  description,
  descriptionStyle,
  alertType = 'success',
  backgroundColor,
  textColor,
  ContainerComponent,
  maxTitleLines,
  maxDescriptionLines,
}) => {
  const Container = ContainerComponent ?? SafeContainer;
  const textStyle = textColor ? { color: textColor } : null;
  return (
    <Container style={{ backgroundColor: backgroundColor || bgColors[alertType] }}>
      <View style={s.container}>
        {!!title && (
          <Text style={[s.title, textStyle, titleStyle]} numberOfLines={maxTitleLines}>
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

export default AlertComponent;
