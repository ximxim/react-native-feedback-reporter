import React, { useContext, useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { setJIRAApiHeaders } from './JIRAApi.service';
import { ProjectSelector, IssueTypeSelector } from './components';
import {
  postJIRAIssue,
  IPostJIRAIssueResponse,
  postJIRAIssueAttachents,
} from './mutations';

import { GlobalProps, IReportFormValues, Typography } from '../../components';

export const useJIRAIntegration = () => {
  const [issue, setIssue] = useState<IPostJIRAIssueResponse>();
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const { jira } = useContext(GlobalProps);
  const {
    register,
    getValues,
    unregister,
  } = useFormContext<IReportFormValues>();

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

  setJIRAApiHeaders(jira);

  const submitToJIRA = async () => {
    setIssue(undefined);

    const {
      uri,
      title,
      description,
      JIRAProject: projectId,
      JIRAIssueType: issueTypeId,
    } = getValues();

    if (!jira || !projectId || !issueTypeId) return;

    const { username, token } = jira;

    const res = await postJIRAIssue({
      title,
      projectId,
      issueTypeId,
      description,
    });

    setIssue(res.data);

    if (!res.data.key) return;

    await postJIRAIssueAttachents({
      content: uri,
      username,
      token,
      key: res.data.key,
    });
  };

  const JIRAComponents = isRegistered && (
    <>
      <ProjectSelector defaultValue={jira?.projectField?.defaultValue} />
      <IssueTypeSelector defaultValue={jira?.issueTypeField?.defaultValue} />
    </>
  );

  const JIRAConfirmationComponents = issue && (
    <Typography variant="h1" onPress={() => Linking.openURL(issue.self)}>
      {issue.key}
    </Typography>
  );

  return {
    submitToJIRA,
    JIRAComponents,
    JIRAConfirmationComponents,
  };
};
