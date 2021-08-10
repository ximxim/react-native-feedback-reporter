import { createContext } from 'react';

import type { IConsumerProps } from './ConsumerProps.types';

export const ConsumerProps = createContext<IConsumerProps>({
  isEnabled: false,
  setIsEnabled: () => {},
});
