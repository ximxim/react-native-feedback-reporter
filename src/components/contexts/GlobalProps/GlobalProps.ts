import { createContext } from 'react';

import type { IFeedbackReporterProps } from './GlobalProps.types';

import type { IAuthStateReturn } from '../../../hooks';
import type { IModalButtonProps } from '../../../components';

interface IAdditionalProps extends IAuthStateReturn {
  isModalOpen: boolean;
  modalHeaderLeftState?: IModalButtonProps;
  setIsModalOpen: (isModalOpen: boolean) => void;
  setModalHeaderLeftState: (props: IModalButtonProps) => void;
}

export interface IGlobalProps
  extends IFeedbackReporterProps,
    IAdditionalProps {}

export const GlobalProps = createContext<IGlobalProps>({
  authState: {},
  isModalOpen: false,
  devNotes: undefined,
  setAuthState: () => {},
  setIsModalOpen: () => {},
  setModalHeaderLeftState: () => {},
});
