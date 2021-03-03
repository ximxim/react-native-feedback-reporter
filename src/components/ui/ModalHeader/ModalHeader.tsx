import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import * as Styled from './ModalHeader.style';
import type { IModalHeaderProps } from './ModalHeader.types';

export const ModalHeader = ({
  left,
  heading,
  right,
  ...viewProps
}: IModalHeaderProps) => {
  const Blank = <View style={{ flex: 1 }} />;

  const LeftComponent = left
    ? left.component || (
        <TouchableOpacity onPress={left.onPress}>
          <Styled.Close>{left.label || 'Clear'}</Styled.Close>
        </TouchableOpacity>
      )
    : Blank;

  const RightComponent = right
    ? right.component || (
        <TouchableOpacity onPress={right.onPress}>
          <Styled.Close>{right.label || 'Close'}</Styled.Close>
        </TouchableOpacity>
      )
    : Blank;

  return (
    <Styled.ModalHeader {...viewProps}>
      {LeftComponent}
      <Styled.ModalHeading>{heading}</Styled.ModalHeading>
      {RightComponent}
    </Styled.ModalHeader>
  );
};
