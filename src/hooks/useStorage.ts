import { useContext } from 'react';

import { GlobalProps } from '../components';

interface IUseStorageProps {
  key: string;
}

export const useStorage = ({ key }: IUseStorageProps) => {
  const { asyncStorage } = useContext(GlobalProps);

  const setItem = async (value: string | object): Promise<void> => {
    if (!asyncStorage?.setItem) return;
    const val = typeof value === 'string' ? value : JSON.stringify(value);
    return asyncStorage?.setItem?.(key, val);
  };

  const getItem = async (): Promise<string> => {
    if (!asyncStorage?.getItem) return '';
    const result = await asyncStorage?.getItem?.(key);
    return result;
  };

  return { setItem, getItem };
};
