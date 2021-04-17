import React from 'react';
import { useEffect, useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { IReportFormValues, GlobalProps, Switch } from '../../../components';

export const useSlackSwitch = () => {
  const { slack } = useContext(GlobalProps);
  const {
    setValue,
    register,
    unregister,
  } = useFormContext<IReportFormValues>();

  useEffect(() => {
    if (!slack) return;

    register('slackSwitch');
    setValue('slackSwitch', !!slack);

    return () => {
      unregister(['slackSwitch']);
    };
  }, [register]);

  return (
    !!slack && (
      <Switch
        onChange={(val) => setValue('slackSwitch', val)}
        label="Enable slack integration"
        defaultValue={!!slack}
      />
    )
  );
};
