import styled from 'styled-components/native';
import { ViewProps, View, Platform } from 'react-native';
import React, { FunctionComponent, ReactNode } from 'react';

export interface IBottomWrapperProps extends ViewProps {
  children: ReactNode;
}

const Wrapper = styled(View)`
  border-top-width: 0.5px;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
  background-color: ${({ theme }) => theme.colors.brandPrimary};
  margin-bottom: ${Platform.select({ android: 70, default: 0 })}px;
`;

export const BottomWrapper: FunctionComponent<IBottomWrapperProps> = ({
  children,
  ...viewProps
}) => <Wrapper {...viewProps}>{children}</Wrapper>;

export default BottomWrapper;
