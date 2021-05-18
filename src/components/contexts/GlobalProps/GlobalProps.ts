import { createContext } from 'react';

import type { IFeedbackReporterProps } from './GlobalProps.types';

import type { IAuthStateReturn } from '../../../hooks';

interface IAdditionalProps extends IAuthStateReturn {
  isModalOpen: boolean;
}

export interface IGlobalProps
  extends IFeedbackReporterProps,
    IAdditionalProps {}

export const GlobalProps = createContext<IGlobalProps>({
  isModalOpen: false,
  authState: {},
  setAuthState: () => {},
});
