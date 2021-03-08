import React, { useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { ProjectSelector, IssueTypeSelector } from './components';
import { setJIRAApiHeaders } from './JIRAApi.service';

import { GlobalProps, IReportFormValues } from '../../components';
import { postJIRAIssue, postJIRAIssueAttachents } from './mutations';

export const useJIRAIntegration = () => {
  const { jira } = useContext(GlobalProps);
  const {
    register,
    getValues,
    unregister,
  } = useFormContext<IReportFormValues>();

  useEffect(() => {
    register('JIRAProject');
    register('JIRAIssueType');

    return () => unregister(['JIRAIssueType', 'JIRAProject']);
  }, [register]);

  if (!jira) return { JIRAComponents: null, submitToJIRA: () => {} };

  setJIRAApiHeaders(jira);

  const submitToJIRA = async () => {
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

    if (!res.data.key) return;

    await postJIRAIssueAttachents({
      content: uri,
      username,
      token,
      key: res.data.key,
    });
  };

  const JIRAComponents = (
    <>
      <ProjectSelector defaultValue={jira?.projectField?.defaultValue} />
      <IssueTypeSelector defaultValue={jira?.issueTypeField?.defaultValue} />
    </>
  );

  return { JIRAComponents, submitToJIRA };
};
