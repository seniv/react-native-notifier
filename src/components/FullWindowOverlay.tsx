import type { ReactNode } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Position } from '../types';
import { styles } from '../styles';

let RNScreenFullWindowOverlay:
  | ((props: { children: React.ReactNode }) => React.JSX.Element)
  | undefined;
try {
  RNScreenFullWindowOverlay = require('react-native-screens').FullWindowOverlay;
} catch (error) {}

interface FullWindowOverlayProps {
  children: ReactNode;
  position: Position;
  useOverlay?: boolean;
  viewStyle?: StyleProp<ViewStyle>;
}
export const FullWindowOverlay = ({
  children,
  position,
  useOverlay,
  viewStyle,
}: FullWindowOverlayProps) => {
  if (Platform.OS !== 'ios' || !useOverlay || !RNScreenFullWindowOverlay)
    return children;

  const isBottom =
    position === 'bottom' ||
    position === 'bottomLeft' ||
    position === 'bottomRight';

  return (
    <RNScreenFullWindowOverlay>
      <View style={[isBottom && styles.bottomFullWindowOverlay, viewStyle]}>
        {children}
      </View>
    </RNScreenFullWindowOverlay>
  );
};
