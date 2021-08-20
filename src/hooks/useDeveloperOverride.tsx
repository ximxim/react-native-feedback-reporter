import { useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

import { ConsumerProps } from '../components';

export interface IUseDeveloperOverride {
  times?: number;
  numDaysToExpire?: number;
}

export const useDeveloperOverride = (props?: IUseDeveloperOverride) => {
  const times = props?.times || 10;
  const numDaysToExpire = props?.numDaysToExpire || 0;

  const {
    setRNFRPermission,
    RNFRPermission: { isEnabled },
  } = useContext(ConsumerProps);
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    if (counter < times) return;

    setRNFRPermission({
      isEnabled: !isEnabled,
      expires: numDaysToExpire
        ? numDaysToExpire < 999
          ? new Date(
              new Date().valueOf() + numDaysToExpire * 1000 * 60 * 60 * 24
            ).toISOString()
          : undefined
        : new Date(new Date().getTime() + 30 * 60000).toISOString(),
    });
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
    increment: () => !isEnabled && setCounter((count) => count + 1),
  };
};
