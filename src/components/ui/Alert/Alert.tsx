import React, { useEffect } from 'react';
import { LayoutAnimation } from 'react-native';

import * as Styled from './Alert.style';
import type { IAlertProps } from './Alert.types';

import { Typography } from '../Typography';

export const Alert = ({ alert, isLoading, ...viewProps }: IAlertProps) => {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isLoading]);

  return (
    <Styled.Wrapper {...viewProps}>
      {isLoading && <Styled.ActivityIndicator />}
      <Typography my={2} variant="subtitle2" textAlign="center">
        {alert}
      </Typography>
    </Styled.Wrapper>
  );
};
