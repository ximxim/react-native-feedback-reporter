import { TouchableOpacity, Animated } from 'react-native';
import styled from 'styled-components/native';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const Wrapper = styled(TouchableOpacity)`
  width: 50px;
  height: 50px;
  padding: 12px;
  overflow: hidden;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;

// export const Icon = styled(MaterialIcon)`
//     color: ${({ theme }) => theme.colors.brandSecondary};
// `;

export const AnimatedView = styled(Animated.View)`
  width: 1px;
  height: 1px;
  opacity: 0.3;
  border-radius: 25px;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.brandSecondary};
`;
