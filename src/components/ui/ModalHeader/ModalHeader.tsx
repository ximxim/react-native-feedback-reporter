import React from 'react';

import * as Styled from './ModalHeader.style';
import type { IModalHeaderProps } from './ModalHeader.types';
import { Typography } from '../Typography';

export const ModalHeader = ({
  left,
  heading,
  right,
  ...viewProps
}: IModalHeaderProps) => {
  const Blank = <Styled.Close />;

  const LeftComponent = left
    ? left.component || (
        <Styled.Close onPress={left.onPress}>
          <Typography variant="body2">{left.label || 'Clear'}</Typography>
        </Styled.Close>
      )
    : Blank;

  const RightComponent = right
    ? right.component || (
        <Styled.Close onPress={right.onPress}>
          <Typography variant="body2" textAlign="right">
            {right.label || 'Close'}
          </Typography>
        </Styled.Close>
      )
    : Blank;

  const Heading = (
    <Styled.ModalHeading>
      <Typography variant="body1" textAlign="center">
        {heading}
      </Typography>
    </Styled.ModalHeading>
  );

  return (
    <Styled.ModalHeader {...viewProps}>
      {LeftComponent}
      {Heading}
      {RightComponent}
    </Styled.ModalHeader>
  );
};
