import { useState } from 'react';

import type { IModalButtonProps } from '../components';

export const useModalHeaderLeftState = () => {
  const [
    modalHeaderLeftState,
    setModalHeaderLeftState,
  ] = useState<IModalButtonProps>();

  return {
    modalHeaderLeftState,
    setModalHeaderLeftState,
  };
};
