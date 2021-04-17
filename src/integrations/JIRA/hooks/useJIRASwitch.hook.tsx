import React from 'react';
import { useEffect, useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { IReportFormValues, GlobalProps, Switch } from '../../../components';

export const useJIRASwitch = () => {
  const { jira } = useContext(GlobalProps);
  const {
    setValue,
    register,
    unregister,
  } = useFormContext<IReportFormValues>();

  useEffect(() => {
    if (!jira) return;

    register('JIRASwitch');
    setValue('JIRASwitch', !!jira);

    return () => {
      unregister(['JIRASwitch']);
    };
  }, [register]);

  return (
    !!jira && (
      <Switch
        onChange={(val) => setValue('JIRASwitch', val)}
        label="Enable JIRA integration"
        defaultValue={!!jira}
      />
    )
  );
};
