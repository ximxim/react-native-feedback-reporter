import { createContext } from 'react';

import type { IFeedbackReporterProps } from './GlobalProps.types';

import type { IAuthStateReturn } from '../../../hooks';

interface IAdditionalProps extends IAuthStateReturn {
  isModalOpen: boolean;
}

export const GlobalProps = createContext<
  IFeedbackReporterProps & IAdditionalProps
>({
  isModalOpen: false,
  authState: {},
  setAuthState: () => {},
});
