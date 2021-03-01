import React, { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components/native';
import { ViewProps, View } from 'react-native';

export interface IBottomWrapperProps extends ViewProps {
  children: ReactNode;
}

const Wrapper = styled(View)`
  border-top-width: 0.5px;
  border-color: ${({ theme }) => theme.colors.brandSecondary};
  background-color: ${({ theme }) => theme.colors.brandPrimary};
`;

export const BottomWrapper: FunctionComponent<IBottomWrapperProps> = ({
  children,
  ...viewProps
}) => <Wrapper {...viewProps}>{children}</Wrapper>;

export default BottomWrapper;
