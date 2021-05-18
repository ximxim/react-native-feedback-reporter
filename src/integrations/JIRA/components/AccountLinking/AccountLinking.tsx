import React, { FunctionComponent } from 'react';

import type { IAccountLinkingProps } from './AccountLinking.types';

import { Typography, Box } from '../../../../components';

export const AccountLinking: FunctionComponent<IAccountLinkingProps> = ({
  ...props
}) => {
  return (
    <Box mx={2}>
      <Typography variant="caption" {...props}>
        Connected to azim@lazertechnologies.com long press here to disconnect.
      </Typography>
    </Box>
  );
};
