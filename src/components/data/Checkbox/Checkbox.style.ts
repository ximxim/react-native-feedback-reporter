import { TouchableOpacity, Animated } from 'react-native';
import styled from 'styled-components/native';

export const Wrapper = styled(TouchableOpacity)`
  margin: 8px;
  flex-direction: row;
  align-items: center;
`;

export const IconWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.View<{ isChecked: boolean; theme: RNFRThemeType }>`
  height: 22px;
  width: 22px;
  align-items: center;
  justify-content: center;
  border-color: black;
  border-width: 1px;
  border-radius: 4px;
  background-color: ${({ isChecked }) => (isChecked ? 'black' : 'transparent')};
`;

export const Check = styled.View<{ theme: RNFRThemeType }>`
  transform: rotate(45deg);
  height: 14px;
  width: 7px;
  margin-bottom: 3px;
  border-bottom-width: 2px;
  border-bottom-color: white;
  border-right-width: 2px;
  border-right-color: white;
`;

export const IconPulse = styled(Animated.View)`
  width: 1px;
  height: 1px;
  opacity: 0.3;
  border-radius: 25px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.brandSecondary};
`;
