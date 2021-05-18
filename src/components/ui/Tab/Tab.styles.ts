import { Animated } from 'react-native';
import styled from 'styled-components/native';

// import type { ITabStyleProps } from './Tab.types';

export const Line = styled(Animated.View)`
  height: 2px;
  background-color: ${({ theme }) => theme.colors.brandSecondary};
`;
