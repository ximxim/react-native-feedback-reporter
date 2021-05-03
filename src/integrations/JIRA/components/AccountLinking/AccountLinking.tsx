import { TouchableOpacity } from 'react-native';
import React, { FunctionComponent, useContext, useRef } from 'react';

import type { IAccountLinkingProps } from './AccountLinking.types';

import { Typography, PopoverContext } from '../../../../components';

export const AccountLinking: FunctionComponent<IAccountLinkingProps> = () => {
  const { openPopover } = useContext(PopoverContext);
  const ref = useRef<TouchableOpacity>(null);

  const handleShowPopover = () => {
    openPopover({
      ref,
      anchor: 'bottom-left',
      component: <Typography>Something is better than nothing</Typography>,
    });
  };

  return (
    <TouchableOpacity onPress={handleShowPopover} ref={ref}>
      <Typography variant="body1">Link Account</Typography>
    </TouchableOpacity>
  );
};
