import React, { useEffect, FunctionComponent, useState, useRef } from 'react';
import { LayoutAnimation, Animated } from 'react-native';

import * as Styled from './CollapsibleView.style';
import type { ICollapsibleViewProps } from './CollapsibleView.types';
import {
  animateIn,
  animateOut,
  interpolateRotation,
  customLayoutAnimation,
} from './CollapsibleView.animation';

import { Typography } from '../Typography';

export const CollapsibleView: FunctionComponent<ICollapsibleViewProps> = ({
  label,
  children,
  onChange = () => {},
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const rotationValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      animateIn(rotationValue);
    } else {
      animateOut(rotationValue);
    }
  }, [isOpen]);

  const labelColor = false ? 'brandPrimary' : 'brandSecondary';

  const Label = (
    <Styled.LabelWrapper
      isOpen={isOpen}
      onPress={() => {
        LayoutAnimation.configureNext(customLayoutAnimation);
        onChange(!isOpen);
        setIsOpen(!isOpen);
      }}
    >
      <Styled.Label>
        <Typography variant="body1" color={labelColor}>
          {label}
        </Typography>
      </Styled.Label>
      <Styled.ArrowWrapper>
        <Animated.View style={interpolateRotation(rotationValue)}>
          <Typography
            m={0}
            variant="h5"
            fontSize={20}
            lineHeight={20}
            color={labelColor}
          >
            {'V'}
          </Typography>
        </Animated.View>
      </Styled.ArrowWrapper>
    </Styled.LabelWrapper>
  );

  const Content = isOpen && (
    <Styled.ContentWrapper>{children}</Styled.ContentWrapper>
  );

  return (
    <Styled.Wrapper>
      {Label}
      {Content}
    </Styled.Wrapper>
  );
};
