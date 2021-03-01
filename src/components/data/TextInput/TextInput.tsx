import React, { useState, useRef, useEffect } from 'react';
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Animated,
  LayoutAnimation,
} from 'react-native';

import * as Styled from './TextInput.style';
import type { ITextInputProps } from './TextInput.types';

import { Typography, Container, Spacing } from '../../ui';

export const TextInput = ({
  label,
  onFocus,
  onBlur,
  error,
  placeholder,
  onChangeText,
  containerStyle,
  // maskType,
  value: propValue,
  ...textInputProps
}: ITextInputProps) => {
  const [value, setValue] = useState<string>(propValue || '');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const hasValue = !!value;
  const hasError = !!error;
  const duration = 150;

  const useNativeDriver = true;
  const moveUp = Animated.timing(translateY, {
    toValue: -28.5,
    duration,
    useNativeDriver,
  });
  const moveDown = Animated.timing(translateY, {
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
    toValue: 0.9,
    duration,
    useNativeDriver,
  });

  const handleFocus = (
    event: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    Animated.parallel([moveUp, scaleDown]).start();
    setIsFocused(true);
    onFocus && onFocus(event);
  };

  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (!hasValue) {
      Animated.parallel([moveDown, scaleUp]).start();
    }
    setIsFocused(false);
    onBlur && onBlur(event);
  };

  useEffect(() => {
    if (hasValue) {
      Animated.parallel([moveUp, scaleDown]).start();
    }
  }, []);

  useEffect(() => {
    if (propValue === value) return;
    onChangeText && onChangeText(value);
  }, [value]);

  useEffect(() => {
    setValue(propValue || '');
  }, [propValue]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [hasError]);

  const handleTextChange = (val: string) => setValue(val);

  const Label = (
    <Styled.LabelWrapper style={{ transform: [{ translateY }, { scale }] }}>
      <Typography {...{ hasError, isFocused }} variant="body1">
        {label}
      </Typography>
    </Styled.LabelWrapper>
  );

  const Error = hasError && (
    <Spacing margin={14} isHorizontal>
      <Typography hasError variant="subtitle2">
        {error}
      </Typography>
    </Spacing>
  );

  return (
    <Container>
      <Styled.Wrapper {...{ hasError, isFocused, style: containerStyle }}>
        {Label}
        <Styled.TextInput
          {...textInputProps}
          value={value}
          onBlur={handleBlur}
          onFocus={handleFocus}
          hasValue={hasValue}
          onChangeText={handleTextChange}
          placeholder={isFocused ? placeholder : ''}
        />
      </Styled.Wrapper>
      {Error}
    </Container>
  );
};
