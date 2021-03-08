import React, { useContext, useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { initJIRAApi } from './JIRAApi.service';
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

    const { username, token, domain } = jira;

    const res = await postJIRAIssue({
      title,
      projectId,
      issueTypeId,
      description,
    });

    setIssue(res.data);

    if (!res.data.key) return;

    await postJIRAIssueAttachents({
      token,
      domain,
      username,
      content: uri,
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
  };
};
