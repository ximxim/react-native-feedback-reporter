import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const percent = 2.5;

export const Wrapper = styled.Image`
  width: ${width / percent}px;
  height: ${height / percent}px;
  align-self: center;
  margin: 8px;
  border-radius: 4px;
  border-width: 0.5px;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
`;
