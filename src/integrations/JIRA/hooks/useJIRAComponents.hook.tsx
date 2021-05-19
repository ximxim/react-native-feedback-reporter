import React, { useContext, useEffect, useCallback, useState } from 'react';
import { LayoutAnimation, View } from 'react-native';
import { useFormContext } from 'react-hook-form';

import {
  ProjectSelector,
  IssueTypeSelector,
  AccountLinking,
  AccountLinkingForm,
} from '../components';
import { useJIRAProjects } from './useJIRAProjects.hook';
import { useJIRAIssueType } from './useJIRAIssueType.hook';
import { useJIRASwitch } from './useJIRASwitch.hook';
import { JIRAComponents as JIRAComponentsEnum } from '../JIRA.types';

import { useNavigation } from '../../../hooks';
import { GlobalProps, IReportFormValues } from '../../../components';

export const useJIRAComponents = () => {
  const [pg, setPg] = useState<number>(0);
  const projectOptions = useJIRAProjects();
  const issueTypeOptions = useJIRAIssueType();
  const Switch = useJIRASwitch();
  const { jira, setAuthState } = useContext(GlobalProps);
  const { watch } = useFormContext<IReportFormValues>();
  const isEnabled = watch('JIRASwitch');
  const components = {
    [JIRAComponentsEnum.JIRASwitch]: Switch,
    [JIRAComponentsEnum.JIRAProjects]: isEnabled && (
      <ProjectSelector options={projectOptions} />
    ),
    [JIRAComponentsEnum.JIRAIssueTypes]: isEnabled && (
      <IssueTypeSelector options={issueTypeOptions} />
    ),
    [JIRAComponentsEnum.JIRAAccountLinking]: isEnabled && (
      <AccountLinking
        onPress={() => {
          setAuthState({});
          setPg(0);
        }}
      />
    ),
  };
  const order = jira?.order || [
    JIRAComponentsEnum.JIRASwitch,
    JIRAComponentsEnum.JIRAProjects,
    JIRAComponentsEnum.JIRAIssueTypes,
    JIRAComponentsEnum.JIRAAccountLinking,
  ];
  const AccountLinkingComponents = useCallback(
    (ref) => (
      <View ref={ref}>
        <AccountLinkingForm next={() => setPg(1)} />
      </View>
    ),
    [components]
  );

  const IssueComponents = useCallback(
    (ref) => <View ref={ref}>{order.map((key) => components[key])}</View>,
    [components]
  );
  const data = [
    { component: AccountLinkingComponents },
    { component: IssueComponents },
  ];

  const { Navigation, setPageNumber } = useNavigation({ data }, [isEnabled]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isEnabled]);

  const JIRAComponents = useCallback(
    (ref: any) => <View ref={ref}>{Navigation}</View>,
    [components]
  );

  useEffect(() => {
    setPageNumber(pg);
  }, [pg]);

  return {
    isEnabled,
    JIRAComponents,
  };
};
