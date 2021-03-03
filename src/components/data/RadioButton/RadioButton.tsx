import React, { useRef, useEffect, FunctionComponent } from 'react';
import {
  GestureResponderEvent,
  Animated,
  ListRenderItem,
  FlatList,
} from 'react-native';

import * as Styled from './RadioButton.style';
import type { IRadioButtonPickerProps, IOption } from './RadioButton.types';

export const RadioButton: FunctionComponent<IRadioButtonPickerProps> = ({
  label,
  error,
  value,
  options,
  onChange,
  ...otherViewProps
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hasError = !!error;
  const hasLabel = !!label;

  const handlePress = async (
    event: GestureResponderEvent,
    key: string,
    onPress?: (event: GestureResponderEvent) => void
  ) => {
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

    onChange(key);
    onPress && onPress(event);
  };

  useEffect(() => {
    onChange(value);
  }, []);

  const renderItem: ListRenderItem<IOption> = ({
    item: { key, value: val, onPress, ...otherTouchableProps },
    index,
  }) => {
    const isSelected = value === key;

    return (
      <Styled.OptionWrapper
        {...otherTouchableProps}
        key={index}
        activeOpacity={0.6}
        isFirst={index === 0}
        isLast={index === options.length - 1}
        onPress={(event) => handlePress(event, key, onPress)}
      >
        <Styled.IconWrapper>
          <Styled.Icon {...{ isSelected }} />
          {isSelected && (
            <Styled.IconPulse
              style={{
                transform: [{ scale }],
                opacity,
              }}
            />
          )}
        </Styled.IconWrapper>
        <Styled.OptionLabel>{val}</Styled.OptionLabel>
      </Styled.OptionWrapper>
    );
  };

  return (
    <Styled.Wrapper {...otherViewProps}>
      {hasLabel && <Styled.Label {...{ hasError }}>{label}</Styled.Label>}
      <Styled.OptionsList>
        <FlatList
          data={options}
          renderItem={renderItem}
          initialNumToRender={20}
          keyExtractor={(item) => item.key}
        />
      </Styled.OptionsList>
      {hasError && <Styled.Error>{error}</Styled.Error>}
    </Styled.Wrapper>
  );
};
