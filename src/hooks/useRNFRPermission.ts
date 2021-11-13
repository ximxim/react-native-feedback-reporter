import { useState, useEffect } from 'react';

import { useStorage } from './useStorage';

export interface IRNFRPermission {
  isEnabled: boolean;
  expires?: string;
}

export const INITIAL_RNFR_PERMISSION: IRNFRPermission = {
  isEnabled: false,
};

export const useRNFRPermission = () => {
  const key = 'RNFRIsEnabled';
  const { getItem, setItem } = useStorage({ key });
  const [RNFRPermission, setRNFRPermission] = useState<IRNFRPermission>(
    INITIAL_RNFR_PERMISSION
  );
  const { isEnabled, expires } = RNFRPermission;

  useEffect(() => {
    (async () => {
      const value = await getItem();
      const parsedValue = value ? JSON.parse(value) : null;

      if (!parsedValue) return;

      setRNFRPermission(parsedValue);
    })();
  }, []);

  const handleSetRNFRPermission = (props: IRNFRPermission) => {
    setRNFRPermission(props);
    setItem(props);
  };

  const hasExpired = expires && new Date() > new Date(expires);

  return {
    RNFRPermission,
    isEnabled: isEnabled && !hasExpired,
    setRNFRPermission: handleSetRNFRPermission,
  };
};
