import React, { FunctionComponent } from 'react';

import type { IAccountLinkingProps } from './AccountLinking.types';

import { Typography } from '../../../../components';

export const AccountLinking: FunctionComponent<IAccountLinkingProps> = () => {
  return (
    <Typography variant="caption" onLongPress={console.log}>
      Connected to azim@lazertechnologies.com long press here to disconnect.
    </Typography>
  );
};
