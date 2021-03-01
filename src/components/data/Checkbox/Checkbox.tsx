import React, { useState, useRef, useEffect } from 'react';
import { GestureResponderEvent, Animated } from 'react-native';

import * as Styled from './Checkbox.style';
import type { ICheckboxPickerProps } from './Checkbox.types';

import { Typography, Container, Spacing } from '../../ui';

export const Checkbox = ({
  label,
  error,
  // value,
  onChange,
  onPress,
  ...otherTouchableOpacityProps
}: ICheckboxPickerProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hasError = !!error;
  const hasLabel = !!label;

  const handlePress = async (event: GestureResponderEvent) => {
    const duration = 200;
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
      toValue: 35,
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

    setIsChecked(!isChecked);
    onPress && onPress(event);
  };

  useEffect(() => {
    onChange(isChecked);
  }, [isChecked]);

  const Label = hasLabel && (
    <Spacing margin={10} isHorizontal>
      <Typography variant="caption">{label}</Typography>
    </Spacing>
  );

  const Error = hasError && (
    <Spacing margin={8} isHorizontal>
      <Typography hasError variant="subtitle2">
        {error}
      </Typography>
    </Spacing>
  );

  // const Icon = (
  //   <Styled.Icon
  //     {...{ hasError, size: 22 }}
  //     name={isChecked ? 'check-box': 'check-box-outline-blank'}
  //   />
  // );

  const Pulse = isChecked && (
    <Styled.IconPulse
      style={{
        transform: [{ scale }],
        opacity,
      }}
    />
  );

  return (
    <Container>
      <Styled.Wrapper {...otherTouchableOpacityProps} onPress={handlePress}>
        <Styled.IconWrapper>
          {/* {Icon} */}
          {Pulse}
        </Styled.IconWrapper>
        {Label}
      </Styled.Wrapper>
      {Error}
    </Container>
  );
};
