import { StyleSheet, Platform, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    width: '100%',
    // @ts-ignore
    position: Platform.select({
      web: 'fixed',
      default: 'absolute',
    }),
    top: 0,
    left: 0,
  },
  translucentStatusBarPadding: {
    paddingTop: StatusBar.currentHeight ?? 0,
  },
});
