import React, { FunctionComponent, useEffect, useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';

import type { ITabProps } from './Tab.types';
import * as Styled from './Tab.styles';

import { Typography } from '../Typography';

export const Tab: FunctionComponent<ITabProps> = ({
  label,
  isSelected = false,
  ...touchableProps
}) => {
  const scale = useRef<Animated.Value>(new Animated.Value(0)).current;
  const opacity = useRef<Animated.Value>(new Animated.Value(0)).current;
  const duration = 300;
  const useNativeDriver = true;
  const fadeIn = Animated.timing(opacity, {
    toValue: 1,
    duration,
    useNativeDriver,
  });
  const fadeOut = Animated.timing(opacity, {
    toValue: 0,
    duration,
    useNativeDriver,
  });
  const scaleUp = Animated.timing(scale, {
    toValue: 1,
    duration,
    useNativeDriver,
  });
  const scaleDown = Animated.timing(scale, {
    toValue: 0,
    duration,
    useNativeDriver,
  });

  useEffect(() => {
    (isSelected
      ? Animated.parallel([fadeIn, scaleUp])
      : Animated.parallel([fadeOut, scaleDown])
    ).start();
  }, [isSelected]);

  return (
    <TouchableOpacity {...touchableProps}>
      <Typography
        py={1}
        px={12}
        variant="button"
        color={isSelected ? 'brandSecondary' : 'brandMuted'}
      >
        {label}
      </Typography>
      <Styled.Line style={{ transform: [{ scale }], opacity }} />
    </TouchableOpacity>
  );
};
