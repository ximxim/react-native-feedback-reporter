import { useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

import { ConsumerProps } from '../components';

export const useDeveloperOverride = (times: number) => {
  const { isEnabled, setIsEnabled } = useContext(ConsumerProps);
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    if (counter < times) return;

    setIsEnabled(!isEnabled);
  }, [counter]);

  useEffect(() => {
    if (!isEnabled || counter < times) return;

    Alert.alert(
      'RNFR',
      'React native feedback reporter is now enabled. Try taking a screen shot.',
      [{ text: 'Okay' }]
    );
  }, [isEnabled, counter]);

  return {
    increment: () => setCounter((count) => count + 1),
  };
};
