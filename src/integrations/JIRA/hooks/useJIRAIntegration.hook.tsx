import React, { useContext, useEffect } from 'react';
import { Linking } from 'react-native';

import { initJIRAApi } from '../JIRAApi.service';
import { useJIRASubmission } from './useJIRASubmission.hook';
import { useJIRAComponents } from './useJIRAComponents.hook';

import {
  Typography,
  GlobalProps,
  AttachmentAlert,
  SubmissionOrderEnum,
} from '../../../components';

export const useJIRAIntegration = () => {
  const { isEnabled, JIRAComponents } = useJIRAComponents();
  const {
    issue,
    isDone,
    isLoading,
    isAttaching,
    submitToJIRA,
  } = useJIRASubmission();
  const { jira, authState } = useContext(GlobalProps);

  useEffect(() => {
    if (!jira) return;
    initJIRAApi({ ...jira, jira: authState.jira });
  }, [authState]);

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
      <AttachmentAlert isAttaching={isAttaching} />
    </>
  );

  const handleSubmit = isEnabled ? submitToJIRA : null;

  return {
    submitToJIRA: handleSubmit,
    JIRAComponents,
    isJIRALoading: isLoading,
    isJIRAUploadDone: isDone,
    isJIRAEnabled: isEnabled,
    JIRAConfirmationComponents: {
      [SubmissionOrderEnum.Jira]: JIRAConfirmationComponents,
    },
  };
};
