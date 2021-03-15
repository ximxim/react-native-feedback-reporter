import React, { useEffect } from 'react';
import { LayoutAnimation } from 'react-native';

import * as Styled from './Alert.style';
import type { IAlertProps } from './Alert.types';

import { Typography } from '../Typography';

export const Alert = ({
  alert,
  variant = 'brandPrimary',
  isLoading,
  ...viewProps
}: IAlertProps) => {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isLoading]);

  return (
    <Styled.Wrapper {...{ ...viewProps, variant }}>
      {isLoading && <Styled.ActivityIndicator />}
      <Typography
        my={2}
        variant="subtitle2"
        textAlign="center"
        color={variant === 'brandDanger' ? 'brandPrimary' : 'brandSecondary'}
      >
        {alert}
      </Typography>
    </Styled.Wrapper>
  );
};
