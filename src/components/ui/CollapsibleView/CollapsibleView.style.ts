import styled from 'styled-components/native';
import { lighten } from 'polished';

export const Wrapper = styled.View<RNFRThemeType>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.brandPrimary};
`;

export const LabelWrapper = styled.TouchableOpacity<
  { isOpen: boolean } & RNFRThemeType
>`
  padding-top: 8px;
  padding-bottom: 4px;
  padding-left: 16px;
  padding-right: 16px;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ isOpen }) => (isOpen ? 0 : 8)}px;
  border-top-width: 1px;
  justify-content: center;
  border-bottom-width: ${({ isOpen }) => (isOpen ? 0 : 1)}px;
  background-color: ${({ theme, isOpen }) =>
    isOpen
      ? lighten(theme.colors.lightenLevels.lvl2, theme.colors.brandPrimary)
      : theme.colors.brandPrimary};
  border-top-color: ${({ theme }) => theme.colors.brandSecondary};
  border-bottom-color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const Label = styled.View`
  flex: 4;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
`;

export const ArrowWrapper = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
`;

export const ContentWrapper = styled.View<RNFRThemeType>`
  padding-top: 8px;
  margin-bottom: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.brandSecondary};
  background-color: ${({ theme }) =>
    lighten(theme.colors.lightenLevels.lvl2, theme.colors.brandPrimary)};
`;

export const Image = styled.Image`
  width: 40px;
  height: 40px;
`;
