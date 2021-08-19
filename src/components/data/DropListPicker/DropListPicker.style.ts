import { lighten } from 'polished';
import styled from 'styled-components/native';
import { TextInput, TouchableOpacity, Animated } from 'react-native';

export const Container = styled.View``;

export const Wrapper = styled(TouchableOpacity)<
  {
    isFocused: boolean;
    hasError: boolean;
  } & RNFRThemeType
>`
  flex-grow: 1;
  margin: 8px;
  border-width: 1px;
  position: relative;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.brandPrimary};
  border-color: ${({ theme, isFocused, hasError }) => {
    if (hasError) return theme.colors.brandDanger;
    if (isFocused) return theme.colors.brandSecondary;
    return theme.colors.brandMuted;
  }};
`;

export const LabelWrapper = styled(Animated.View)<RNFRThemeType>`
  position: absolute;
  top: 18.5px;
  left: 4px;
  padding: 0px 10px;
  background-color: ${({ theme }) => theme.colors.brandPrimary};
`;

export const Modal = styled.Modal``;

export const ModalHeader = styled.View<RNFRThemeType>`
  flex-direction: row;
  border-bottom-width: 2px;
  justify-content: space-between;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const ModalWrapper = styled.SafeAreaView<RNFRThemeType>`
  flex: 1;
  background-color: ${({ theme }) =>
    lighten(theme.colors.lightenLevels.lvl2, theme.colors.brandPrimary)};
`;

export const OptionsWrapper = styled.View`
  flex: 1;
`;

export const SearchInput = styled(TextInput).attrs(
  ({ theme }: RNFRThemeType) => ({
    placeholderTextColor: theme.colors.brandMuted,
  })
)<RNFRThemeType>`
  font-size: 16px;
  font-weight: 400;
  padding: 18.5px 14px;
  color: ${({ theme }) => theme.colors.brandSecondary};
`;
