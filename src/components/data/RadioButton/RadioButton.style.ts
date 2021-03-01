import { TouchableOpacity, View, Animated } from 'react-native';
import styled from 'styled-components/native';

import type { IOptionsWrapperProps } from './RadioButton.types';

export const Wrapper = styled(View)``;

export const OptionsList = styled.View`
  border-top-width: 0.5px;
  border-bottom-width: 0.5px;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const OptionWrapper = styled(TouchableOpacity)<IOptionsWrapperProps>`
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

// export const Icon = styled(MaterialIcon)`
//   color: ${({ theme }) => theme.colors.brandSecondary};
// `;

export const IconPulse = styled(Animated.View)`
  width: 1px;
  height: 1px;
  opacity: 0.3;
  border-radius: 25px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const Label = styled.Text<{ hasError: boolean }>`
  margin: 8px;
  color: ${({ theme, hasError }) =>
    hasError ? theme.colors.brandDanger : theme.colors.brandSecondary};
`;

export const OptionLabel = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-left: 10px;
  color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const Error = styled.Text`
  margin: 8px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.brandDanger};
`;
