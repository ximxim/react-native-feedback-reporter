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

  if (!jira) {
    return {
      JIRAComponents: {
        [FormOrderEnum.JIRAProjects]: null,
        [FormOrderEnum.JIRAIssueTypes]: null,
        [FormOrderEnum.JIRASwitch]: null,
      },
      submitToJIRA: () => {},
    };
  }

  const JIRAComponents = {
    [FormOrderEnum.JIRASwitch]: null,
    [FormOrderEnum.JIRAProjects]: <ProjectSelector options={projectOptions} />,
    [FormOrderEnum.JIRAIssueTypes]: (
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
    JIRAConfirmationComponents,
  };
};
