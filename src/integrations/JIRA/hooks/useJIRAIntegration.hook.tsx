import React, { useContext, useEffect, useCallback } from 'react';
import { Linking, LayoutAnimation, View } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { initJIRAApi } from '../JIRAApi.service';
import {
  ProjectSelector,
  IssueTypeSelector,
  AccountLinking,
} from '../components';
import { useJIRASubmission } from './useJIRASubmission.hook';
import { useJIRAProjects } from './useJIRAProjects.hook';
import { useJIRAIssueType } from './useJIRAIssueType.hook';
import { useJIRASwitch } from './useJIRASwitch.hook';
import { JIRAComponents as JIRAComponentsEnum } from '../JIRA.types';

import {
  Alert,
  Typography,
  GlobalProps,
  IReportFormValues,
  SubmissionOrderEnum,
} from '../../../components';

export const useJIRAIntegration = () => {
  const projectOptions = useJIRAProjects();
  const issueTypeOptions = useJIRAIssueType();
  const Switch = useJIRASwitch();
  const { issue, submitToJIRA, isAttaching } = useJIRASubmission();
  const { jira } = useContext(GlobalProps);
  const isJIRAIssueCreated = jira ? !!issue : true;
  const { watch } = useFormContext<IReportFormValues>();
  const isEnabled = watch('JIRASwitch');
  const order = jira?.order || [
    JIRAComponentsEnum.JIRASwitch,
    JIRAComponentsEnum.JIRAProjects,
    JIRAComponentsEnum.JIRAIssueTypes,
    JIRAComponentsEnum.JIRAAccountLinking,
  ];

  useEffect(() => {
    if (!jira) return;
    initJIRAApi(jira);
  }, []);

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
    [JIRAComponentsEnum.JIRAAccountLinking]: isEnabled && <AccountLinking />,
  };

  const JIRAComponents = useCallback(
    (ref: any) => <View ref={ref}>{order.map((key) => components[key])}</View>,
    [components]
  );

  const JIRAConfirmationComponents = issue && (
    <>
      <Typography
        my="10"
        variant="h2"
        textAlign="center"
        onPress={() => Linking.openURL(issue.self)}
      >
        JIRA
      </Typography>
      <Typography
        textAlign="center"
        onPress={() => Linking.openURL(issue.self)}
      >
        <Typography variant="body1">Issue ID: </Typography>
        <Typography variant="link" fontSize={18}>
          {issue.key}
        </Typography>
      </Typography>
      <Alert
        alert={
          isAttaching
            ? 'Uploading attachments in the background. Feel free to continue using the app. Dismissing this screen will not stop the uploads'
            : 'Attachments uploaded'
        }
        isLoading={isAttaching}
      />
    </>
  );

  const handleSubmit = isEnabled ? submitToJIRA : null;

  return {
    submitToJIRA: handleSubmit,
    JIRAComponents,
    isJIRAIssueCreated,
    isJIRAEnabled: isEnabled,
    JIRAConfirmationComponents: {
      [SubmissionOrderEnum.Jira]: JIRAConfirmationComponents,
    },
  };
};
