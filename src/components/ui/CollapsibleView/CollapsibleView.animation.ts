import { Animated, LayoutAnimation } from 'react-native';

const springAnimationConfig = {
  stiffness: 200,
  mass: 0.5,
  damping: 100,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
  useNativeDriver: true,
};

export const animateIn = (rotationValue: Animated.Value) => {
  Animated.spring(rotationValue, {
    toValue: 180,
    ...springAnimationConfig,
  }).start();
};

export const animateOut = (rotationValue: Animated.Value) => {
  Animated.spring(rotationValue, {
    toValue: 0,
    ...springAnimationConfig,
  }).start();
};

export const interpolateRotation = (rotationValue: Animated.Value) => ({
  transform: [
    {
      rotate: rotationValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '-180deg'],
      }),
    },
  ],
});

export const customLayoutAnimation = {
  ...LayoutAnimation.Presets.easeInEaseOut,
  duration: 150,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
    delay: 150,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  delete: {
    duration: 50,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};
