import styled from 'styled-components/native';
import { Animated, TouchableOpacity, View } from 'react-native';
import type {
  IOptionProps,
  IOptionPulseProps,
  IOptionLabelProps,
  ISegmentOptionsWrapperProps,
} from './SegmentSelector.types';

export const OptionsWrapper = styled(View)<ISegmentOptionsWrapperProps>`
  border-width: 1px;
  border-radius: 4px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.brandPrimary};
  border-color: ${({ theme, hasError }) =>
    hasError ? theme.colors.brandDanger : theme.colors.brandSecondary};
`;

export const Option = styled(TouchableOpacity)<IOptionProps>`
  flex-grow: 1;
  padding: 6px 16px;
  overflow: hidden;
  border-color: ${({ theme, hasError }) =>
    hasError ? theme.colors.brandDanger : theme.colors.brandSecondary};
  border-right-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
`;

export const OptionPulse = styled(Animated.View)<IOptionPulseProps>`
  width: 1px;
  height: 1px;
  align-self: center;
  border-radius: 300px;
  background-color: ${({ theme, hasError }) =>
    hasError ? theme.colors.brandDanger : theme.colors.brandSecondary};
`;

export const OptionLabel = styled.Text<IOptionLabelProps>`
  z-index: 1;
  font-size: 16px;
  text-align: center;
  color: ${({ theme, isSelected, hasError }) => {
    if (!isSelected && hasError) return theme.colors.brandDanger;
    if (isSelected && !hasError) return theme.colors.brandPrimary;
    return theme.colors.brandSecondary;
  }};
`;
