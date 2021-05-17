import React, { useContext, useEffect, useCallback } from 'react';
import { LayoutAnimation, View } from 'react-native';
import { useFormContext } from 'react-hook-form';

import {
  ProjectSelector,
  IssueTypeSelector,
  AccountLinking,
} from '../components';
import { useJIRAProjects } from './useJIRAProjects.hook';
import { useJIRAIssueType } from './useJIRAIssueType.hook';
import { useJIRASwitch } from './useJIRASwitch.hook';
import { JIRAComponents as JIRAComponentsEnum } from '../JIRA.types';

import { GlobalProps, IReportFormValues } from '../../../components';

export const useJIRAComponents = () => {
  const projectOptions = useJIRAProjects();
  const issueTypeOptions = useJIRAIssueType();
  const Switch = useJIRASwitch();
  const { jira } = useContext(GlobalProps);
  const { watch } = useFormContext<IReportFormValues>();
  const isEnabled = watch('JIRASwitch');
  const order = jira?.order || [
    JIRAComponentsEnum.JIRASwitch,
    JIRAComponentsEnum.JIRAProjects,
    JIRAComponentsEnum.JIRAIssueTypes,
    JIRAComponentsEnum.JIRAAccountLinking,
  ];

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isEnabled]);

  const components = {
    [JIRAComponentsEnum.JIRASwitch]: Switch,
    [JIRAComponentsEnum.JIRAProjects]: isEnabled && (
      <ProjectSelector options={projectOptions} />
    ),
    [JIRAComponentsEnum.JIRAIssueTypes]: isEnabled && (
      <IssueTypeSelector options={issueTypeOptions} />
    ),
    [JIRAComponentsEnum.JIRAAccountLinking]: isEnabled && (
      <AccountLinking onLongPress={console.log} />
    ),
  };

  const JIRAComponents = useCallback(
    (ref: any) => <View ref={ref}>{order.map((key) => components[key])}</View>,
    [components]
  );

  return {
    isEnabled,
    JIRAComponents,
  };
};
