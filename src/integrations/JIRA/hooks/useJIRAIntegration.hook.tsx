import React, { useContext, useEffect } from 'react';
import { Linking } from 'react-native';

import { initJIRAApi } from '../JIRAApi.service';
import { ProjectSelector, IssueTypeSelector } from '../components';
import { useJIRASubmission } from './useJIRASubmission.hook';
import { useJIRAProjects } from './useJIRAProjects.hook';
import { useJIRAIssueType } from './useJIRAIssueType.hook';

import {
  Alert,
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
  const isJIRAIssueCreated = jira ? !!issue : true;

  useEffect(() => {
    if (!jira) return;
    initJIRAApi(jira);
  }, []);

  const JIRAComponents = {
    [FormOrderEnum.JIRASwitch]: null,
    [FormOrderEnum.JIRAProjects]: jira && (
      <ProjectSelector options={projectOptions} />
    ),
    [FormOrderEnum.JIRAIssueTypes]: jira && (
      <IssueTypeSelector options={issueTypeOptions} />
    ),
  };

  const JIRAConfirmationComponents = issue && (
    <>
      <Typography variant="h2" onPress={() => Linking.openURL(issue.self)}>
        JIRA Issue ID
      </Typography>
      <Typography
        variant="link"
        fontSize={22}
        onPress={() => Linking.openURL(issue.self)}
      >
        {issue.key}
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

  return {
    submitToJIRA,
    JIRAComponents,
    isJIRAIssueCreated,
    JIRAConfirmationComponents: {
      [SubmissionOrderEnum.Jira]: JIRAConfirmationComponents,
    },
  };
};
