import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useStorage } from '../../../hooks';
import { IReportFormValues, GlobalProps, Switch } from '../../../components';

export const useSlackSwitch = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const { slack } = useContext(GlobalProps);
  const { setItem, getItem } = useStorage({
    key: 'FEEDBACK_REPORTER_SLACK_SWITCH',
  });
  const {
    setValue,
    register,
    getValues,
    unregister,
  } = useFormContext<IReportFormValues>();

  useEffect(() => {
    (async () => {
      if (!slack) return;

      register('slackSwitch');
      try {
        const value = await getItem();
        setValue('slackSwitch', value ? value === 'true' : !!slack);
      } catch (e) {
        setValue('slackSwitch', !!slack);
      } finally {
        setIsReady(true);
      }
    })();

    return () => {
      unregister(['slackSwitch']);
    };
  }, [register]);

  return (
    !!slack &&
    isReady && (
      <Switch
        onChange={(val) => {
          setItem(val ? 'true' : 'false');
          setValue('slackSwitch', val);
        }}
        label="Enable slack integration"
        defaultValue={getValues('slackSwitch')}
      />
    )
  );
};
