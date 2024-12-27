import { Animated, Platform } from 'react-native';
import type {
  AnimationFunction,
  AnimationFunctionParam,
} from 'react-native-notifier/next';

// utility function that returns convenient values for easier animations
const getFinalAnimationStateAndTranslateY = ({
  animationState,
  componentHeight,
  swipeTranslationY,
}: AnimationFunctionParam) => {
  const finalState = Animated.add(
    Animated.divide(swipeTranslationY, componentHeight),
    animationState
  );
  const translateY = Animated.multiply(
    Animated.subtract(finalState, 1),
    componentHeight
  );

  const stateClamped = finalState.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const translateYClamped = Animated.multiply(
    Animated.subtract(stateClamped, 1),
    componentHeight
  );

  return {
    finalState,
    translateY,
    stateClamped,
    translateYClamped,
  };
};

export const getContainerStyleOpacityTransformScale: AnimationFunction = (
  param
) => {
  const { stateClamped, translateYClamped } =
    getFinalAnimationStateAndTranslateY(param);

  return {
    opacity: stateClamped.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: translateYClamped.interpolate({
          inputRange: [-1000, 0],
          outputRange: [-1000, 0],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: stateClamped.interpolate({
          // start with scale = 1, it's a trick to make correct height calculation
          inputRange: [0, 0.01, 1],
          outputRange: [1, 0, 1],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
};

export const getContainerStyleClassicWithOverSwipe: AnimationFunction = (
  param
) => {
  const { translateY } = getFinalAnimationStateAndTranslateY(param);
  return {
    transform: [
      {
        // from negative values to 0 it is dragging as usual, but dragging down is 20x slower.
        translateY: translateY.interpolate({
          inputRange: [-1, 0, 20],
          outputRange: [-1, 0, 1],
        }),
      },
    ],
  };
};

export const getContainerStyleOpacityOnly: AnimationFunction = (param) => {
  const { stateClamped } = getFinalAnimationStateAndTranslateY(param);
  return {
    opacity: stateClamped,
    transform: undefined,
  };
};

export const getContainerStyleScaleOnly: AnimationFunction = (param) => {
  const { stateClamped } = getFinalAnimationStateAndTranslateY(param);
  return {
    // use opacity to avoid flickering when scale = 1 while state = 0
    opacity: stateClamped.interpolate({
      inputRange: [0.01, 0.02],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        scale: stateClamped.interpolate({
          inputRange: [0, 0.01, 1],
          outputRange: [1, 0, 1],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
};

export const getContainerStyleScaleAndRotation: AnimationFunction = (param) => {
  const { stateClamped } = getFinalAnimationStateAndTranslateY(param);
  return {
    // use opacity to avoid flickering when scale = 1 while state = 0
    opacity: stateClamped.interpolate({
      inputRange: [0.01, 0.02],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        scale: stateClamped.interpolate({
          inputRange: [0, 0.01, 1],
          outputRange: [1, 0, 1],
          extrapolate: 'clamp',
        }),
      },
      {
        rotate: stateClamped.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
};

// Code from README.md example
export const getContainerStyleWithTranslateAndScale: AnimationFunction = (
  param
) => {
  const { stateClamped, translateYClamped } =
    getFinalAnimationStateAndTranslateY(param);
  return {
    opacity: stateClamped.interpolate({
      inputRange: [0.01, 0.02],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: translateYClamped,
      },
      {
        scale: stateClamped.interpolate({
          inputRange: [0, 0.01, 1],
          outputRange: [1, 0, 1],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
};

export const getContainerStyleBottomPosition: AnimationFunction = ({
  animationState,
  componentHeight,
  swipeTranslationY,
}) => {
  const swipeTranslationYInverted = Animated.multiply(swipeTranslationY, -1);
  const state = Animated.add(
    Animated.divide(swipeTranslationYInverted, componentHeight),
    animationState
  );

  const stateClamped = state.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const translateYClamped = Animated.multiply(
    Animated.subtract(stateClamped, 1),
    Animated.multiply(componentHeight, -1)
  );
  return {
    // unset "top" property that was used in default styles
    top: Platform.select({
      web: 'unset' as unknown as number,
      default: undefined,
    }),
    // add bottom margin
    bottom: 10,
    transform: [
      {
        translateY: translateYClamped,
      },
    ],
  };
};
