import { createContext } from 'react';

import type { IFeedbackReporterProps } from './GlobalProps.types';

import type { IAuthStateReturn } from '../../../hooks';
import type { IModalButtonProps } from '../../../components';

interface IAdditionalProps extends IAuthStateReturn {
  isBusy: boolean;
  isModalOpen: boolean;
  setIsBusy: (isBusy: boolean) => void;
  modalHeaderLeftState?: IModalButtonProps;
  setIsModalOpen: (isModalOpen: boolean) => void;
  setModalHeaderLeftState: (props: IModalButtonProps) => void;
}

export interface IGlobalProps
  extends IFeedbackReporterProps,
    IAdditionalProps {}

export const GlobalProps = createContext<IGlobalProps>({
  authState: {},
  isBusy: false,
  isModalOpen: false,
  devNotes: undefined,
  setIsBusy: () => {},
  setAuthState: () => {},
  setIsModalOpen: () => {},
  setModalHeaderLeftState: () => {},
});
