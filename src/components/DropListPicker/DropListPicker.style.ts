import { lighten } from 'polished';
import styled from 'styled-components/native';
import { TextInput, TouchableOpacity, Animated } from 'react-native';

export const Container = styled.View``;

export const Wrapper = styled(TouchableOpacity)<{
  isFocused: boolean;
  hasError: boolean;
}>`
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

export const Value = styled.Text<{ hasValue: boolean }>`
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

export const Label = styled.Text<{ isFocused: boolean; hasError: boolean }>`
  font-size: 16px;
  font-weight: 400;
  opacity: ${({ isFocused, hasError }) => (isFocused || hasError ? 1 : 0.8)};
  color: ${({ theme, hasError }) =>
    hasError ? theme.colors.brandDanger : theme.colors.brandSecondary};
`;

export const Error = styled.Text`
  font-size: 14px;
  font-weight: 400;
  margin: 0px 14px;
  color: ${({ theme }) => theme.colors.brandDanger};
`;

export const Modal = styled.Modal``;

export const ModalHeader = styled.View`
  flex-direction: row;
  border-bottom-width: 2px;
  justify-content: space-between;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const ModalHeading = styled.Text`
  flex: 8;
  padding: 16px 8px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const Close = styled.Text`
  flex: 1;
  font-size: 14px;
  padding: 16px 8px;
  color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const ModalWrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) =>
    lighten(theme.colors.lightenLevels.lvl2, theme.colors.brandPrimary)};
`;

export const OptionsWrapper = styled.View`
  flex: 1;
`;

export const SearchInput = styled(TextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.brandMuted,
}))`
  font-size: 16px;
  font-weight: 400;
  padding: 18.5px 14px;
  color: ${({ theme }) => theme.colors.brandSecondary};
`;
