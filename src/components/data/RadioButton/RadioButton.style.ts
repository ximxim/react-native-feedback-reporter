import { TouchableOpacity, View, Animated } from 'react-native';
import styled from 'styled-components/native';

import type { IOptionsWrapperProps } from './RadioButton.types';

export const Wrapper = styled(View)``;

export const OptionsList = styled.View<RNFRThemeType>`
  border-top-width: 0.5px;
  border-bottom-width: 0.5px;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const OptionWrapper = styled(TouchableOpacity)<
  IOptionsWrapperProps & RNFRThemeType
>`
  flex-direction: row;
  align-items: center;
  margin-left: 30px;
  padding: 20px 30px 20px 0px;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
  border-top-width: ${({ isFirst }) => (isFirst ? '0px' : '0.5px')};
`;

export const IconWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.View<{ isSelected: boolean } & RNFRThemeType>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.brandPrimary : theme.colors.brandSecondary};
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.brandSecondary : 'transparent'};
  box-shadow: ${({ theme, isSelected }) =>
    `0px 0px ${isSelected ? 2 : 0}px ${theme.colors.brandSecondary}`};
`;

export const IconPulse = styled(Animated.View)<RNFRThemeType>`
  width: 1px;
  height: 1px;
  opacity: 0.3;
  border-radius: 25px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.brandSecondary};
`;
