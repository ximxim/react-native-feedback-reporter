import { TouchableOpacity, Animated } from 'react-native';
import styled from 'styled-components/native';

export const Wrapper = styled(TouchableOpacity)<{ hasIcon: boolean }>`
  flex: 1;
  flex-grow: 1;
  margin: 8px;
  overflow: hidden;
  min-height: 40px;
  padding: 6px 16px;
  border-width: 1px;
  border-radius: 4px;
  flex-direction: row;
  align-items: center;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
  background-color: ${({ theme }) => theme.colors.brandPrimary};
  justify-content: ${({ hasIcon }) => (hasIcon ? 'flex-start' : 'center')};
`;

export const AnimatedView = styled(Animated.View)`
  left: 50%;
  width: 5px;
  height: 150%;
  opacity: 0.3;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.brandSecondary};
`;

export const ActivityIndicator = styled.ActivityIndicator`
  height: 32px;
`;
