import { useState, useEffect } from 'react';

import { useStorage } from './useStorage';

export const useIsEnabled = () => {
  const key = 'RNFRIsEnabled';
  const { getItem, setItem } = useStorage({ key });
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const value = await getItem();
      setIsEnabled(value === 'true');
    })();
  }, []);

  useEffect(() => {
    setItem(isEnabled ? 'true' : 'false');
  }, [isEnabled]);

  return { isEnabled, setIsEnabled };
};
