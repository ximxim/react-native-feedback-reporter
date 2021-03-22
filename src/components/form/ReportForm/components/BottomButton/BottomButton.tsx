import React, { FunctionComponent } from 'react';

import {
  BottomWrapper,
  ButtonWithLabel,
  IButtonWithLabelProps,
} from '../../../../ui';

interface IBottomButtonProps extends Partial<IButtonWithLabelProps> {
  label: string;
}

export const BottomButton: FunctionComponent<IBottomButtonProps> = ({
  label,
  ...props
}) => {
  return (
    <BottomWrapper>
      <ButtonWithLabel {...props}>{label}</ButtonWithLabel>
    </BottomWrapper>
  );
};
