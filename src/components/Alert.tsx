import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

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
  alertType: AlertTypes;
  backgroundColor?: string;
  textColor?: string;
  ContainerComponent?: Function;
}

interface AlertComponentAllProps extends AlertComponentProps {
  title?: string;
  description?: string;
}

const AlertComponent: React.FunctionComponent<AlertComponentAllProps> = ({
  title,
  description,
  alertType = 'success',
  backgroundColor,
  textColor,
  ContainerComponent,
}) => {
  const Container = ContainerComponent ?? SafeContainer;
  const textStyle = textColor ? { color: textColor } : null;
  return (
    <Container style={{ backgroundColor: backgroundColor || bgColors[alertType] }}>
      <View style={s.container}>
        {!!title && <Text style={[s.title, textStyle]}>{title}</Text>}
        {!!description && <Text style={[s.description, textStyle]}>{description}</Text>}
      </View>
    </Container>
  );
};

export default AlertComponent;
