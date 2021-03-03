import { Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

import * as Styled from './DropListPicker.style';
import type { IDropListPickerProps } from './DropListPicker.types';

import { RadioButton } from '../RadioButton';
import { ModalHeader } from '../../ui';

export const DropListPicker = ({
  label,
  error,
  value,
  onBlur,
  options,
  onFocus,
  children,
  onChange,
  placehoder,
  searchInputProps,
  ...otherTouchableOpacityProps
}: IDropListPickerProps) => {
  const [keySelected, setKeySelected] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const hasValue = !!keySelected || !!value;
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
    const val = reset ? '' : keySelected || value;
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
    setKeySelected(value || '');
  }, [value]);

  useEffect(() => {
    const first = options.filter((o) =>
      o.value.toLowerCase().includes(search.toLowerCase())
    )[0];
    if (first && search) setKeySelected(first.key);
  }, [search]);

  const Label = (
    <Styled.Wrapper
      {...{ hasError, isFocused, ...otherTouchableOpacityProps }}
      onPress={handleFocus}
    >
      <Styled.LabelWrapper style={{ transform: [{ translateY }, { scale }] }}>
        <Styled.Label {...{ hasError, isFocused }}>{label}</Styled.Label>
      </Styled.LabelWrapper>
      <Styled.Value hasValue={hasValue}>
        {options.find((option) => option.key === (keySelected || value))?.value}
      </Styled.Value>
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
          right={{ label: 'Select', onPress: () => handleBlur(true) }}
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
            value={keySelected || value || ''}
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
      {hasError && <Styled.Error>{error}</Styled.Error>}
    </Styled.Container>
  );
};
