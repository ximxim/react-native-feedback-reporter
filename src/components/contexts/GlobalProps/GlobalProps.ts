import { createContext } from 'react';

import type { IFeedbackReporterProps } from './GlobalProps.types';

import type { IAuthStateReturn } from '../../../hooks';
import type { IModalButtonProps } from '../../../components';

interface IAdditionalProps extends IAuthStateReturn {
  isModalOpen: boolean;
  setModalHeaderLeftState: (props: IModalButtonProps) => void;
}

export interface IGlobalProps
  extends IFeedbackReporterProps,
    IAdditionalProps {}

export const GlobalProps = createContext<IGlobalProps>({
  isModalOpen: false,
  authState: {},
  setAuthState: () => {},
  setModalHeaderLeftState: () => {},
});
