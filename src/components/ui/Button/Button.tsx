import React, { useRef } from 'react';
import { GestureResponderEvent, Animated } from 'react-native';

import * as Styled from './Button.style';
import type { IButtonProps } from './Button.types';

export const Button = ({
  // name,
  onPress,
  children,
  ...touchableProps
}: IButtonProps) => {
  const scale = useRef<Animated.Value>(new Animated.Value(0)).current;
  const opacity = useRef<Animated.Value>(new Animated.Value(0)).current;
  const handleOnPress = (event: GestureResponderEvent) => {
    const duration = 300;
    const useNativeDriver = true;
    const fadeIn = Animated.timing(opacity, {
      toValue: 0.5,
      duration,
      useNativeDriver,
    });
    const fadeOut = Animated.timing(opacity, {
      toValue: 0,
      duration,
      useNativeDriver,
    });
    const scaleUp = Animated.timing(scale, {
      toValue: 50,
      duration,
      useNativeDriver,
    });
    const scaleDown = Animated.timing(scale, {
      toValue: 0,
      duration,
      useNativeDriver,
    });

    Animated.parallel([fadeIn, scaleUp]).start(() =>
      fadeOut.start(() => scaleDown.start())
    );

    onPress && onPress(event);
  };

  return (
    <Styled.Wrapper
      onPress={handleOnPress}
      activeOpacity={0.6}
      {...touchableProps}
    >
      <Styled.AnimatedView
        style={{
          transform: [{ scale }],
          opacity,
        }}
      />
      {children}
      {/* {name && <Styled.Icon name={name} size={24} />} */}
    </Styled.Wrapper>
  );
};
