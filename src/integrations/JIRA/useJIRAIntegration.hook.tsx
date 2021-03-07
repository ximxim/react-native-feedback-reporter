import { NativeModules } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { ProjectSelector, IssueTypeSelector } from './components';
import { setJIRAApiHeaders } from './JIRAApi.service';

import { uploadFiles, toBase64 } from '../../utils';
import { GlobalProps, IReportFormValues } from '../../components';

export const useJIRAIntegration = () => {
  const module = NativeModules.FeedbackReporter;
  const filename = 'screenshot.png';
  const filepath = `${module.TemporaryDirectoryPath}/${filename}`;
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
    if (!jira) return;
    return uploadFiles({
      toUrl: 'https://ximxim.atlassian.net/rest/api/3/issue/AP-2/attachments',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${toBase64(`${jira.username}:${jira.token}`)}`,
        'X-Atlassian-Token': 'no-check',
      },
      files: [
        {
          content: getValues('uri'),
          name: 'file',
          filename,
          filepath,
          filetype: 'image/png',
        },
      ],
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
