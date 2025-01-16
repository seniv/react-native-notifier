import { memo, useCallback } from 'react';
import { Animated, View } from 'react-native';
import type {
  AnimationFunctionParams,
  Notification,
  ViewWithOffsetsComponent,
} from '../types';
import { useOffsets } from '../hooks/useOffsets';

interface RenderComponentWithOffsetsProps {
  notification: Notification;
  hide: (callback?: Animated.EndCallback) => void;
  animationFunctionParams: AnimationFunctionParams;
}
export const RenderComponentWithOffsets = memo(
  ({
    notification,
    animationFunctionParams,
    hide,
  }: RenderComponentWithOffsetsProps) => {
    const offsets = useOffsets(notification);

    const ViewWithOffsets = useCallback<ViewWithOffsetsComponent>(
      ({ style, mode = 'padding', ...props }) => (
        <View
          style={[
            {
              [`${mode}Top`]: offsets.top,
              [`${mode}Right`]: offsets.right,
              [`${mode}Bottom`]: offsets.bottom,
              [`${mode}Left`]: offsets.left,
            },
            style,
          ]}
          {...props}
        />
      ),
      [offsets]
    );

    const { Component } = notification;

    return (
      <Component
        title={notification.title}
        description={notification.description}
        offsets={offsets}
        ViewWithOffsets={ViewWithOffsets}
        hide={hide}
        animationFunctionParams={animationFunctionParams}
        {...notification.componentProps}
      />
    );
  }
);
