import { createContext } from 'react';

import type { IGlobalProps } from './GlobalProps.types';

export const GlobalProps = createContext<IGlobalProps>({
  isEnabled: true,
});
