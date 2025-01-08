import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    position: 'absolute',
  },
});

export const positionStyles = StyleSheet.create({
  top: {
    top: 0,
    left: 0,
    width: '100%',
  },
  bottom: {
    bottom: 0,
    left: 0,
    width: '100%',
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
});
