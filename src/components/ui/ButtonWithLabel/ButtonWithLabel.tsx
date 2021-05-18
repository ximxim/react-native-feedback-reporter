import React, { useRef } from 'react';
import { GestureResponderEvent, Animated } from 'react-native';

import * as Styled from './ButtonWithLabel.style';
import type { IButtonWithLabelProps } from './ButtonWithLabel.types';

import { Typography, Box } from '../../ui';

export const ButtonWithLabel = ({
  onPress,
  icon,
  children,
  isLoading,
  disabled,
  ...touchableProps
}: IButtonWithLabelProps) => {
  const scaleX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hasIcon = !!icon;
  const handleOnPress = async (event: GestureResponderEvent) => {
    const duration = 300;
    const useNativeDriver = true;
    const fadeIn = Animated.timing(opacity, {
      toValue: 0.3,
      duration,
      useNativeDriver,
    });
    const fadeOut = Animated.timing(opacity, {
      toValue: 0,
      duration,
      useNativeDriver,
    });
    const scaleUp = Animated.timing(scaleX, {
      toValue: 100,
      duration,
      useNativeDriver,
    });
    const scaleDown = Animated.timing(scaleX, {
      toValue: 0,
      duration,
      useNativeDriver,
    });

    await new Promise((resolve) =>
      Animated.parallel([fadeIn, scaleUp]).start(() =>
        fadeOut.start(() => {
          resolve(null);
          scaleDown.start(resolve);
        })
      )
    );

    onPress && onPress(event);
  };

  const ButtonContent = isLoading ? (
    <Styled.ActivityIndicator />
  ) : (
    <Box height={32}>
      <Typography variant="button">{children}</Typography>
    </Box>
  );

  return (
    <Styled.Wrapper
      activeOpacity={0.6}
      onPress={handleOnPress}
      disabled={disabled || isLoading}
      {...{ touchableProps, hasIcon }}
    >
      <Styled.AnimatedView
        style={{
          transform: [{ scaleX }],
          opacity,
        }}
      />
      {ButtonContent}
    </Styled.Wrapper>
  );
};
