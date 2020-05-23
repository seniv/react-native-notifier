import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    width: '100%',
    // @ts-ignore
    position: Platform.select({
      web: 'fixed',
      default: 'absolute',
    }),
    top: 0,
    left: 0,
  },
});
