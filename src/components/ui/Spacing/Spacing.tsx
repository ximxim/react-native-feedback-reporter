import React, { FunctionComponent } from 'react';

import * as Styled from './Spacing.styles';
import type { ISpacingProps } from './Spacing.types';

export const Spacing: FunctionComponent<ISpacingProps> = ({
  children,
  ...props
}) => {
  return <Styled.Wrapper {...props}>{children}</Styled.Wrapper>;
};

export default Spacing;
