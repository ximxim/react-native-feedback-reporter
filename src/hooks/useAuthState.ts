import { useState } from 'react';

import type { IAccountLinkingFormValues } from '../integrations';

export interface IAuthState {
  jira?: IAccountLinkingFormValues;
}

export interface IAuthStateReturn {
  authState: IAuthState;
  setAuthState: (authState: IAuthState) => void;
}

export const useAuthState = (): IAuthStateReturn => {
  const [authState, setAuthState] = useState<IAuthState>({});

  const handleSetAuthState = (newState: IAuthState) => {
    setAuthState({ ...authState, ...newState });
  };

  return {
    authState,
    setAuthState: handleSetAuthState,
  };
};
