import React, { useState, useEffect, FunctionComponent } from 'react';

import * as Styled from './Switch.style';
import type { ISwitchProps } from './Switch.types';

import { Typography, Container, Spacing } from '../../ui';

export const Switch: FunctionComponent<ISwitchProps> = ({
  label,
  error,
  defaultValue,
  onChange,
  onValueChange,
  ...otherSwitchProps
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(!!defaultValue);
  const hasError = !!error;
  const hasLabel = !!label;

  const handlePress = async (value: boolean) => {
    setIsChecked(value);
    onValueChange?.(value);
  };

  useEffect(() => {
    onChange(isChecked);
  }, [isChecked]);

  const Label = hasLabel && (
    <Spacing margin={10} isHorizontal>
      <Typography variant="caption">{label}</Typography>
    </Spacing>
  );

  const Error = hasError && (
    <Spacing margin={8} isHorizontal>
      <Typography hasError variant="subtitle2">
        {error}
      </Typography>
    </Spacing>
  );

  const Icon = (
    <Styled.Icon
      {...{ hasError, ...otherSwitchProps }}
      value={isChecked}
      onValueChange={handlePress}
    />
  );

  return (
    <Container>
      <Styled.Wrapper>
        <Styled.IconWrapper>{Icon}</Styled.IconWrapper>
        {Label}
      </Styled.Wrapper>
      {Error}
    </Container>
  );
};
