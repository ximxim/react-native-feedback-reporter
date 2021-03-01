import React, { useState, useRef, useEffect } from 'react';
import { GestureResponderEvent, Animated } from 'react-native';

import * as Styled from './SegmentSelector.style';
import type { ISegmentSelectorProps } from './SegmentSelector.types';

import { Typography, Spacing } from '../../ui';

export const SegmentSelector = ({
  label,
  error,
  options,
  onChange,
  value,
  ...otherViewProps
}: ISegmentSelectorProps) => {
  const [selected, setSelected] = useState<string>('');
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hasError = !!error;
  const duration = 200;

  const handlePress = async (
    event: GestureResponderEvent,
    key: string,
    onPress?: (event: GestureResponderEvent) => void
  ) => {
    const useNativeDriver = true;
    const fadeOut = Animated.timing(opacity, {
      toValue: 0,
      duration,
      useNativeDriver,
    });
    const scaleDown = Animated.timing(scale, {
      toValue: 0,
      duration,
      useNativeDriver,
    });

    await new Promise((resolve) =>
      Animated.parallel([fadeOut, scaleDown]).start(resolve)
    );

    setSelected(key);
    onPress && onPress(event);
  };

  useEffect(() => {
    value && setSelected(value);
  }, []);

  useEffect(() => {
    (async () => {
      const useNativeDriver = true;
      const fadeIn = Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver,
      });
      const scaleUp = Animated.timing(scale, {
        toValue: 300,
        duration,
        useNativeDriver,
      });

      await new Promise((resolve) =>
        Animated.parallel([fadeIn, scaleUp]).start(resolve)
      );
      onChange(selected);
    })();
  }, [selected]);

  const Options = options.map(
    (
      { key, value, onPress, disabled, ...otherTouchaleOpacityProps },
      index
    ) => (
      <Styled.Option
        {...otherTouchaleOpacityProps}
        onPress={(event) => handlePress(event, key, onPress)}
        isLast={index === options.length - 1}
        disabled={key === selected || disabled}
        hasError={hasError}
        key={key}
      >
        <Styled.OptionLabel isSelected={key === selected} hasError={hasError}>
          {value}
        </Styled.OptionLabel>
        {key === selected && (
          <Styled.OptionPulse
            style={{ opacity, transform: [{ scale }] }}
            hasError={hasError}
          />
        )}
      </Styled.Option>
    )
  );

  const Label = (
    <Spacing margin={8} isVertical>
      <Typography {...{ hasError }} variant="caption">
        {label}
      </Typography>
    </Spacing>
  );

  const Error = hasError && (
    <Spacing margin={8} isVertical>
      <Typography hasError variant="subtitle2">
        {error}
      </Typography>
    </Spacing>
  );

  return (
    <Spacing margin={8}>
      {Label}
      <Styled.OptionsWrapper {...otherViewProps} hasError={hasError}>
        {Options}
      </Styled.OptionsWrapper>
      {Error}
    </Spacing>
  );
};
