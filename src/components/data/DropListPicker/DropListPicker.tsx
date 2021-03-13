import { Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

import * as Styled from './DropListPicker.style';
import type { IDropListPickerProps } from './DropListPicker.types';

import { RadioButton } from '../RadioButton';
import { ModalHeader, Typography } from '../../ui';

export const DropListPicker = ({
  label,
  error,
  onBlur,
  options,
  onFocus,
  children,
  onChange,
  placehoder,
  defaultValue,
  searchInputProps,
  ...otherTouchableOpacityProps
}: IDropListPickerProps) => {
  const [keySelected, setKeySelected] = useState<string>(defaultValue || '');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const hasValue = !!keySelected;
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

  const handleFocus = () => {
    Animated.parallel([moveUp, scaleDown]).start();
    setIsFocused(true);
    onFocus && onFocus();
  };

  const handleBlur = (reset?: boolean) => {
    const val = reset ? '' : keySelected;
    setSearch('');
    setKeySelected(val || '');
    if (!val) {
      Animated.parallel([moveDown, scaleUp]).start();
    }
    setIsFocused(false);
    onBlur && onBlur();
  };

  useEffect(() => {
    if (hasValue) {
      Animated.parallel([moveUp, scaleDown]).start();
    }
  }, [hasValue]);

  useEffect(() => {
    onChange(keySelected);
  }, [keySelected]);

  useEffect(() => {
    const first = options.filter((o) =>
      o.value.toLowerCase().includes(search.toLowerCase())
    )[0];
    if (first && search) setKeySelected(first.key);
  }, [search]);

  useEffect(() => {
    setKeySelected(defaultValue || '');
  }, [defaultValue]);

  const Label = (
    <Styled.Wrapper
      {...{ hasError, isFocused, ...otherTouchableOpacityProps }}
      onPress={handleFocus}
    >
      <Styled.LabelWrapper style={{ transform: [{ translateY }, { scale }] }}>
        <Typography
          variant="body1"
          opacity={isFocused || hasError ? 1 : 0.8}
          color={hasError ? 'brandDanger' : 'brandSecondary'}
        >
          {label}
        </Typography>
      </Styled.LabelWrapper>
      <Typography
        variant="body1"
        mx={14}
        my={18.5}
        color={hasValue ? 'brandSecondary' : 'transparent'}
      >
        {options.find((option) => option.key === keySelected)?.value}
      </Typography>
    </Styled.Wrapper>
  );

  const Modal = (
    <Styled.Modal
      transparent
      visible={isFocused}
      animationType="slide"
      presentationStyle="overFullScreen"
    >
      <Styled.ModalWrapper>
        <ModalHeader
          left={{ label: 'Clear', onPress: () => handleBlur(true) }}
          heading={placehoder || 'Select One'}
          right={{ label: 'Select', onPress: () => handleBlur(false) }}
        />
        <Styled.OptionsWrapper>
          <Styled.SearchInput
            autoFocus
            selectTextOnFocus
            value={search}
            placeholder="Search..."
            onChangeText={setSearch}
            {...searchInputProps}
          />
          <RadioButton
            value={keySelected || ''}
            onChange={setKeySelected}
            options={options.filter((o) =>
              o.value.toLowerCase().includes(search.toLowerCase())
            )}
          />
        </Styled.OptionsWrapper>
      </Styled.ModalWrapper>
    </Styled.Modal>
  );

  return children ? (
    <>
      {children({ keySelected, isFocused, setIsFocused })}
      {Modal}
    </>
  ) : (
    <Styled.Container>
      {Label}
      {Modal}
      {hasError && (
        <Typography variant="body2" mx={14} color="brandDanger">
          {error}
        </Typography>
      )}
    </Styled.Container>
  );
};
