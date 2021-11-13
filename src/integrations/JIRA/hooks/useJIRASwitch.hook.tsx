import React, { useEffect, useContext, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useStorage } from '../../../hooks';
import { IReportFormValues, GlobalProps, Switch } from '../../../components';

export const useJIRASwitch = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const { jira, authState } = useContext(GlobalProps);
  const { setItem, getItem } = useStorage({
    key: 'FEEDBACK_REPORTER_JIRA_SWITCH',
  });
  const {
    register,
    setValue,
    getValues,
    unregister,
  } = useFormContext<IReportFormValues>();

  useEffect(() => {
    (async () => {
      if (!jira) return;

      register('JIRASwitch');

      if (!(authState.jira?.token || jira.token)) {
        return setValue('JIRASwitch', false);
      }

      try {
        const value = await getItem();
        setValue('JIRASwitch', value ? value === 'true' : !!jira);
      } catch (e) {
        setValue('JIRASwitch', !!jira);
      } finally {
        setIsReady(true);
      }
    })();
    return () => {
      unregister(['JIRASwitch']);
    };
  }, [register, authState]);

  return (
    !!jira &&
    isReady && (
      <Switch
        onChange={(val) => {
          setItem(val ? 'true' : 'false');
          setValue('JIRASwitch', val);
        }}
        label="Enable JIRA integration"
        defaultValue={getValues('JIRASwitch')}
      />
    )
  );
};
