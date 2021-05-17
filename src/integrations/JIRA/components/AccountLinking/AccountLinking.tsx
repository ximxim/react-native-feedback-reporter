import React, { FunctionComponent } from 'react';

import type { IAccountLinkingProps } from './AccountLinking.types';

import { Typography } from '../../../../components';

export const AccountLinking: FunctionComponent<IAccountLinkingProps> = ({
  ...props
}) => {
  return (
    <Typography variant="caption" {...props}>
      Connected to azim@lazertechnologies.com long press here to disconnect.
    </Typography>
  );
};
