import { StyleSheet, type ImageSourcePropType } from 'react-native';

export type Types =
  | 'error'
  | 'warn'
  | 'info'
  | 'success'
  | 'connected'
  | 'disconnected';

export const iconColors: Record<Types, string> = {
  warn: '#FD9F02',
  error: '#F34F4E',
  info: '#3150EC',
  success: '#24BF60',
  connected: '#24BF60',
  disconnected: '#CCCCCC',
};

export const backgroundColors: Record<Types, string> = {
  warn: '#FFF6E5',
  error: '#FFF2F2',
  info: '#F3F3FF',
  success: '#E7F8F0',
  connected: '#E7F8F0',
  disconnected: '#F2F2F2',
};

export const icons: Record<Types, ImageSourcePropType> = {
  warn: require('./icons/warn.png'),
  error: require('./icons/error.png'),
  success: require('./icons/success.png'),
  info: require('./icons/info.png'),
  connected: require('./icons/connected.png'),
  disconnected: require('./icons/disconnected.png'),
};

export const commonStyles = StyleSheet.create({
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 10,
  },
});
