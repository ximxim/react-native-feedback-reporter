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

// TODO: use icon
// export const Icon = styled(MaterialIcon)<{ hasError: boolean }>`
//     color: ${({ theme, hasError }) => hasError ? theme.colors.brandDanger : theme.colors.brandSecondary};
// `;

export const IconPulse = styled(Animated.View)`
  width: 1px;
  height: 1px;
  opacity: 0.3;
  border-radius: 25px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.brandSecondary};
`;
