import { View } from 'react-native';
import styled from 'styled-components/native';

import type { IWrapperProps } from './Avatar.types';

export const Wrapper = styled(View)<IWrapperProps>`
  overflow: hidden;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ theme }) => theme.colors.maleColor};
`;

export const Image = styled.Image<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

export const Initials = styled.Text<{ size: number }>`
  font-size: ${({ size }) => size / 2}px;
  color: ${({ theme }) => theme.colors.brandPrimary};
`;
