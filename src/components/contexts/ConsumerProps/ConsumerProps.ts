import { createContext } from 'react';

import type { IConsumerProps } from './ConsumerProps.types';
import { INITIAL_RNFR_PERMISSION } from '../../../hooks';

export const ConsumerProps = createContext<IConsumerProps>({
  setRNFRPermission: () => {},
  RNFRPermission: INITIAL_RNFR_PERMISSION,
});
