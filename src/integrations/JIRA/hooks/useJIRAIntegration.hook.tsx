import React, { useContext, useEffect } from 'react';
import { Linking } from 'react-native';

import { initJIRAApi } from '../JIRAApi.service';
import { useJIRASubmission } from './useJIRASubmission.hook';
import { useJIRAComponents } from './useJIRAComponents.hook';

import {
  Alert,
  Typography,
  GlobalProps,
  SubmissionOrderEnum,
} from '../../../components';

export const useJIRAIntegration = () => {
  const { isEnabled, JIRAComponents } = useJIRAComponents();
  const { issue, submitToJIRA, isAttaching } = useJIRASubmission();
  const { jira, authState } = useContext(GlobalProps);
  const isJIRAIssueCreated = jira ? !!issue : true;

  useEffect(() => {
    if (!jira) return;
    initJIRAApi({ ...jira, jira: authState.jira });
  }, []);

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
