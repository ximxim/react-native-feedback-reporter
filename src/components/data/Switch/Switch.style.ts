import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const Wrapper = styled.View`
  margin: 8px;
  flex-direction: row;
  align-items: center;
`;

export const IconWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.Switch.attrs(({ theme: { colors }, value }) => ({
  thumbColor: value ? colors.brandPrimary : colors.brandSecondary,
  trackColor: { false: colors.brandPrimary, true: colors.brandSecondary },
}))<{ hasError: boolean }>``;

export const IconPulse = styled(Animated.View)`
  width: 1px;
  height: 1px;
  opacity: 0.3;
  border-radius: 25px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.brandSecondary};
`;
