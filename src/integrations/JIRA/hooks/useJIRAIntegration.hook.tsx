import React, { useContext, useEffect, useState } from 'react';
import { Linking, LayoutAnimation } from 'react-native';

import { initJIRAApi } from '../JIRAApi.service';
import { ProjectSelector, IssueTypeSelector } from '../components';
import { useJIRASubmission } from './useJIRASubmission.hook';
import { useJIRAProjects } from './useJIRAProjects.hook';
import { useJIRAIssueType } from './useJIRAIssueType.hook';

import {
  Alert,
  Switch,
  Typography,
  GlobalProps,
  FormOrderEnum,
  SubmissionOrderEnum,
} from '../../../components';

export const useJIRAIntegration = () => {
  const projectOptions = useJIRAProjects();
  const issueTypeOptions = useJIRAIssueType();
  const { issue, submitToJIRA, isAttaching } = useJIRASubmission();
  const { jira } = useContext(GlobalProps);
  const [isEnabled, setIsEnabled] = useState<boolean>(!!jira);
  const isJIRAIssueCreated = jira ? !!issue : true;

  useEffect(() => {
    if (!jira) return;
    initJIRAApi(jira);
  }, []);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isEnabled]);

  const JIRAComponents = {
    [FormOrderEnum.JIRASwitch]: (
      <Switch
        onChange={setIsEnabled}
        label="Enable JIRA integration"
        defaultValue={!!jira}
      />
    ),
    [FormOrderEnum.JIRAProjects]: isEnabled && (
      <ProjectSelector options={projectOptions} />
    ),
    [FormOrderEnum.JIRAIssueTypes]: isEnabled && (
      <IssueTypeSelector options={issueTypeOptions} />
    ),
  };

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
    JIRAConfirmationComponents: {
      [SubmissionOrderEnum.Jira]: JIRAConfirmationComponents,
    },
  };
};
