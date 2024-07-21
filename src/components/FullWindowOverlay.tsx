import type { ReactNode } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

let RNScreenFullWindowOverlay:
  | ((props: { children: React.ReactNode }) => React.JSX.Element)
  | undefined;
try {
  RNScreenFullWindowOverlay = require('react-native-screens').FullWindowOverlay;
} catch (error) {}

interface FullWindowOverlayProps {
  children: ReactNode;
  useOverlay?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
}
export const FullWindowOverlay = ({
  children,
  useOverlay,
  viewStyle,
}: FullWindowOverlayProps) => {
  if (Platform.OS !== 'ios' || !useOverlay || !RNScreenFullWindowOverlay)
    return children;
  return (
    <RNScreenFullWindowOverlay>
      <View style={viewStyle}>{children}</View>
    </RNScreenFullWindowOverlay>
  );
};
