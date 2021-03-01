import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const Wrapper = styled.View<{ isFocused: boolean; hasError: boolean }>`
  margin: 8px;
  border-width: 1px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.brandPrimary};
  border-color: ${({ theme, isFocused, hasError }) => {
    if (hasError) return theme.colors.brandDanger;
    if (isFocused) return theme.colors.brandSecondary;
    return theme.colors.brandMuted;
  }};
`;

export const TextInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.brandMuted,
}))<{ hasValue: boolean }>`
  font-size: 16px;
  font-weight: 400;
  padding: 18.5px 14px;
  color: ${({ theme, hasValue }) =>
    hasValue ? theme.colors.brandSecondary : 'transparent'};
`;

export const LabelWrapper = styled(Animated.View)`
  position: absolute;
  top: 18.5px;
  left: 4px;
  padding: 0px 10px;
  background-color: ${({ theme }) => theme.colors.brandPrimary};
`;
