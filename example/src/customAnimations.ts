import { Animated } from 'react-native';

export const getContainerStyleOpacityTransformScale = (
  translateY: Animated.Value
) => ({
  opacity: translateY.interpolate({
    inputRange: [-200, 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }),
  transform: [
    {
      translateY: translateY.interpolate({
        inputRange: [-1000, 0],
        outputRange: [-1000, 0],
        extrapolate: 'clamp',
      }),
    },
    {
      scale: translateY.interpolate({
        inputRange: [-1000, -200, 0],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
      }),
    },
  ],
});

export const getContainerStyleClassicWithOverSwipe = (
  translateY: Animated.Value
) => ({
  transform: [
    {
      // from negative values to 0 it is dragging as usual, but dragging down is 20x slower.
      // On iOS it is dragging down with some kind of a "delay"
      // when notification component is wrapped with SafeAreaView (it is wrapped in all default components).
      translateY: translateY.interpolate({
        inputRange: [-1, 0, 20],
        outputRange: [-1, 0, 1],
      }),
    },
  ],
});

export const getContainerStyleOpacityOnly = (translateY: Animated.Value) => ({
  opacity: translateY.interpolate({
    inputRange: [-200, 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }),
  // Transform used to move Notification out of the screen when it is already transparent
  transform: [
    {
      translateY: translateY.interpolate({
        inputRange: [-1000, -200, 0],
        outputRange: [-1000, 0, 0],
        extrapolate: 'clamp',
      }),
    },
  ],
});

export const getContainerStyleScaleOnly = (translateY: Animated.Value) => ({
  transform: [
    {
      // Translate notification out of the screen to make sure it is not visible
      translateY: translateY.interpolate({
        inputRange: [-1000, -200, 0],
        outputRange: [-1000, 0, 0],
        extrapolate: 'clamp',
      }),
    },
    {
      scale: translateY.interpolate({
        inputRange: [-200, 0],
        // On android when scale to "0" notification didn't hide completely.
        // Scaling to 0.1 and translating component out of the screen fixes the problem
        outputRange: [0.1, 1],
        extrapolate: 'clamp',
      }),
    },
  ],
});

export const getContainerStyleScaleAndRotation = (
  translateY: Animated.Value
) => ({
  transform: [
    {
      // Translate notification out of the screen to make sure it is not visible
      translateY: translateY.interpolate({
        inputRange: [-1000, -200, 0],
        outputRange: [-1000, 0, 0],
        extrapolate: 'clamp',
      }),
    },
    {
      scale: translateY.interpolate({
        inputRange: [-200, 0],
        // On android when scale to "0" notification didn't hide completely.
        // Scaling to 0.1 and translating component out of the screen fixes the problem
        outputRange: [0.1, 1],
        extrapolate: 'clamp',
      }),
    },
    {
      rotate: translateY.interpolate({
        inputRange: [-200, 0],
        outputRange: ['0deg', '360deg'],
        extrapolate: 'clamp',
      }),
    },
  ],
});

// Code from README.md example
export const getContainerStyleWithTranslateAndScale = (
  translateY: Animated.Value
) => ({
  transform: [
    {
      // this interpolation is used just to "clamp" the value and didn't allow to drag the notification below "0"
      translateY: translateY.interpolate({
        inputRange: [-1000, 0],
        outputRange: [-1000, 0],
        extrapolate: 'clamp',
      }),
    },
    {
      // scaling from 0 to 0.5 when value is in range of -1000 and -200 because mostly it is still invisible,
      // and from 0.5 to 1 in last 200 pixels to make the scaling effect more noticeable.
      scale: translateY.interpolate({
        inputRange: [-1000, -200, 0],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
      }),
    },
  ],
});

export const getContainerStyleBottomPosition = (
  translateY: Animated.Value
) => ({
  // unset "top" property that was used in default styles
  top: undefined,
  // add bottom margin
  bottom: 10,
  transform: [
    {
      // reverse translateY value
      translateY: translateY.interpolate({
        inputRange: [-1000, 0],
        outputRange: [1000, 0],
        extrapolate: 'clamp',
      }),
    },
  ],
});
