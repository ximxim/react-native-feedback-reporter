import React, { FunctionComponent, useContext } from 'react';

import type { IAccountLinkingProps } from './AccountLinking.types';

import { Typography, Box, GlobalProps } from '../../../../components';

export const AccountLinking: FunctionComponent<IAccountLinkingProps> = ({
  ...props
}) => {
  const { authState } = useContext(GlobalProps);
  const username = authState.jira?.username;

  return (
    <Box mx="8px">
      {username && (
        <Typography variant="caption" {...props}>
          Connected to {username} long press here to disconnect.
        </Typography>
      )}
    </Box>
  );
};
