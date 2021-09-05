import React, { useState, useRef, useEffect } from 'react';
import { GestureResponderEvent, Animated } from 'react-native';

import * as Styled from './Checkbox.style';
import type { ICheckboxPickerProps } from './Checkbox.types';

import { Typography, Box, Spacing } from '../../ui';

export const Checkbox = ({
  label,
  error,
  onChange,
  onPress,
  defaultValue,
  ...otherTouchableOpacityProps
}: ICheckboxPickerProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(defaultValue || false);
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

    Animated.parallel([fadeIn]).start(() => fadeOut.start());

    setIsChecked(!isChecked);
    onPress && onPress(event);
  };

  useEffect(() => {
    onChange(isChecked);
  }, [isChecked]);

  const Label = hasLabel && (
    <Spacing margin={10} isHorizontal>
      <Typography variant="caption" mb={0}>
        {label}
      </Typography>
    </Spacing>
  );

  const Error = hasError && (
    <Spacing margin={8} isHorizontal>
      <Typography hasError variant="subtitle2">
        {error}
      </Typography>
    </Spacing>
  );

  const Icon = (
    <Styled.Icon isChecked={isChecked}>
      {isChecked && <Styled.Check />}
    </Styled.Icon>
  );

  return (
    <Box>
      <Styled.Wrapper {...otherTouchableOpacityProps} onPress={handlePress}>
        <Styled.IconWrapper>{Icon}</Styled.IconWrapper>
        {Label}
      </Styled.Wrapper>
      {Error}
    </Box>
  );
};
