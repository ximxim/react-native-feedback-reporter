import React, { useContext, useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { initJIRAApi } from './JIRAApi.service';
import { ProjectSelector, IssueTypeSelector } from './components';
import { useJIRASubmission } from './useJIRASubmission.hook';

import { GlobalProps, IReportFormValues, Typography } from '../../components';

export const useJIRAIntegration = () => {
  const { issue, submitToJIRA } = useJIRASubmission();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const { jira } = useContext(GlobalProps);
  const { register, unregister } = useFormContext<IReportFormValues>();

  useEffect(() => {
    if (!jira) return;
    initJIRAApi(jira);
  }, []);

  useEffect(() => {
    register('JIRAProject');
    register('JIRAIssueType');
    setIsRegistered(true);

    return () => {
      setIsRegistered(false);
      unregister(['JIRAIssueType', 'JIRAProject']);
    };
  }, [register]);

  if (!jira) return { JIRAComponents: null, submitToJIRA: () => {} };

  const JIRAComponents = isRegistered && (
    <>
      <ProjectSelector defaultValue={jira?.projectField?.defaultValue} />
      <IssueTypeSelector defaultValue={jira?.issueTypeField?.defaultValue} />
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
    </>
  );

  return {
    submitToJIRA,
    JIRAComponents,
    JIRAConfirmationComponents,
    isJIRAIssueCreated: jira ? !!issue : true,
  };
};
