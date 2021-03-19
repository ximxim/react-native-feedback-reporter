import React, { useContext, useEffect } from 'react';
import { Linking } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { initJIRAApi } from '../JIRAApi.service';
import { ProjectSelector, IssueTypeSelector } from '../components';
import { useJIRASubmission } from './useJIRASubmission.hook';
import { useJIRAProjects } from './useJIRAProjects.hook';
import { useJIRAIssueType } from './useJIRAIssueType.hook';

import {
  Alert,
  Typography,
  GlobalProps,
  IReportFormValues,
} from '../../../components';

export const useJIRAIntegration = () => {
  const projectOptions = useJIRAProjects();
  const issueTypeOptions = useJIRAIssueType();
  const { issue, submitToJIRA, isAttaching } = useJIRASubmission();
  const { jira } = useContext(GlobalProps);
  const { formState } = useFormContext<IReportFormValues>();
  const isJIRAIssueCreated = jira ? !!issue : true;

  useEffect(() => {
    if (!jira) return;
    initJIRAApi(jira);
  }, []);

  if (!jira) return { JIRAComponents: null, submitToJIRA: () => {} };

  const JIRAComponents = (
    <>
      <ProjectSelector options={projectOptions} />
      <IssueTypeSelector options={issueTypeOptions} />
    </>
  );

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

  const JIRAFailureComponents = isJIRAIssueCreated && formState.isSubmitted && (
    <Alert
      variant="brandDanger"
      alert="Unable to create JIRA ticket. Please try again."
    />
  );

  return {
    submitToJIRA,
    JIRAComponents,
    JIRAFailureComponents,
    JIRAConfirmationComponents,
    isJIRAIssueCreated,
  };
};
