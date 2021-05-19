import { useState, useEffect } from 'react';

import type { IAccountLinkingFormValues } from '../integrations';
import { useStorage } from './useStorage';

export interface IAuthState {
  jira?: IAccountLinkingFormValues;
}

export interface IAuthStateReturn {
  authState: IAuthState;
  setAuthState: (authState: IAuthState) => void;
}

export const useAuthState = (): IAuthStateReturn => {
  const { setItem, getItem } = useStorage({
    key: 'FEEDBACK_REPORTER_AUTH_STATE',
  });
  const [authState, setAuthState] = useState<IAuthState>({});

  const handleSetAuthState = (newState: IAuthState) => {
    setAuthState({ ...authState, ...newState });
  };

  useEffect(() => {
    setItem(authState);
  }, [authState]);

  useEffect(() => {
    (async () => {
      const newState = await getItem();
      handleSetAuthState(JSON.parse(newState));
    })();
  }, []);

  return {
    authState,
    setAuthState: handleSetAuthState,
  };
};
