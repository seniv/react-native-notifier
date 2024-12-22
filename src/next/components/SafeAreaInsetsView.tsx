import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeAreaInsetsView = ({
  style,
  ...props
}: ComponentProps<typeof View>) => {
  const { top } = useSafeAreaInsets();
  return <View style={[{ paddingTop: top }, style]} {...props} />;
};
