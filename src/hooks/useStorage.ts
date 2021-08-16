import { NativeModules } from 'react-native';

interface IUseStorageProps {
  key: string;
}

interface IGetItemResult {
  code: string;
  value: string;
}

const module = NativeModules.FeedbackReporter;

export const useStorage = ({ key }: IUseStorageProps) => {
  const setItem = async (value: string | object): Promise<void> => {
    const val = typeof value === 'string' ? value : JSON.stringify(value);
    return module.setValue(key, val);
  };

  const getItem = async (): Promise<string | undefined> => {
    try {
      const result: IGetItemResult = await module.getValue(key);
      return result.value;
    } catch (ex) {
      return;
    }
  };

  return { setItem, getItem };
};
