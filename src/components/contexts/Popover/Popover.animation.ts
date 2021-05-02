import { Animated } from 'react-native';

import type { anchorType } from './Popover.types';

const useNativeDriver = true;

const popoverAnimationConfig = {
  useNativeDriver,
  duration: 150,
};

const childrenAnimationConfig = {
  useNativeDriver,
  duration: 30,
};

const getTranslateYValue = (anchor: anchorType, isModalOpen: boolean) => {
  if (!isModalOpen) return 0;

  switch (anchor) {
    case 'top-right':
    case 'top-left':
    case 'top-center':
      return -30;
    case 'bottom-left':
    case 'bottom-right':
      return 30;
    default:
      return 30;
  }
};

export const popoverAnimation = (
  bubbleTranslateY: Animated.Value,
  bubbleOpacity: Animated.Value,
  isModalOpen: boolean,
  anchor: anchorType
) =>
  Animated.parallel([
    // Movement up
    Animated.timing(bubbleTranslateY, {
      ...popoverAnimationConfig,
      toValue: getTranslateYValue(anchor, isModalOpen),
    }),
    // Fading into view
    Animated.timing(bubbleOpacity, {
      ...popoverAnimationConfig,
      toValue: isModalOpen ? 0 : 1,
    }),
  ]);

export const childrenAnimation = (
  scaleXY: Animated.Value,
  opacity: Animated.Value,
  isModalOpen: boolean
) =>
  Animated.parallel([
    // Starting from center and scaling out to diameter
    Animated.timing(scaleXY, {
      ...childrenAnimationConfig,
      toValue: isModalOpen ? 0 : 1,
    }),
    // Fading into view
    Animated.timing(opacity, {
      ...childrenAnimationConfig,
      toValue: isModalOpen ? 0 : 1,
    }),
  ]);
