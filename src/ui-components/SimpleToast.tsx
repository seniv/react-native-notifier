import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  type TextStyle,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import type { NotifierComponentProps } from '../types';

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: '#333333',
    borderRadius: 25,
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22,
    color: '#ffffff',
    alignItems: 'center',
  },
});

export interface SimpleToastProps extends NotifierComponentProps {
  /** The maximum number of lines to use for rendering title.
   * @default null */
  maxTitleLines?: number;

  /** A container of the component. Set it in case you use different SafeAreaView than the custom `ViewWithOffsets`
   * @default ViewWithOffsets */
  ContainerComponent?: React.ElementType;

  /** The style to use for rendering title
   * @default null */
  titleStyle?: StyleProp<TextStyle>;

  /** The style to use for toast container.
   * @default null */
  containerStyle?: StyleProp<ViewStyle>;

  /** The style to use for toast content container.
   * Might be useful to change background color, shadows, paddings or margins
   * @default null */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const SimpleToastComponent = ({
  title,
  titleStyle,
  ContainerComponent,
  maxTitleLines,
  containerStyle,
  contentContainerStyle,
  ViewWithOffsets,
}: SimpleToastProps) => {
  const Container = ContainerComponent ?? ViewWithOffsets;
  return (
    <Container style={[s.container, containerStyle]}>
      <View style={[s.contentContainer, contentContainerStyle]}>
        {!!title && (
          <Text style={[s.title, titleStyle]} numberOfLines={maxTitleLines}>
            {title}
          </Text>
        )}
      </View>
    </Container>
  );
};
