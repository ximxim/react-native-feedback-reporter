import { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMutation } from 'react-query';

import { postJIRAIssue, postJIRAIssueAttachents } from './mutations';

import type { IFile } from '../../utils';
import { IReportFormValues, GlobalProps } from '../../components';

export const useJIRASubmission = () => {
  const [files, setFiles] = useState<IFile[]>([]);
  const { mutate: postIssue, data: issueRes } = useMutation(postJIRAIssue);
  const { mutate: postIssueAttachments, isLoading: isAttaching } = useMutation(
    postJIRAIssueAttachents
  );
  const { getValues } = useFormContext<IReportFormValues>();
  const { jira, devNotes } = useContext(GlobalProps);

  useEffect(() => {
    // TODO: handle ticket creation failure
    if (!issueRes?.data.key || !jira) return;
    const { username, token, domain } = jira;
    const { uri } = getValues();

    postIssueAttachments({
      files,
      token,
      domain,
      username,
      content: uri,
      key: issueRes.data.key,
    });
  }, [issueRes]);

  const submitToJIRA = async (files: IFile[]) => {
    setFiles(files);
    const {
      title,
      description,
      JIRAProject: projectId,
      JIRAIssueType: issueTypeId,
    } = getValues();

    if (!jira || !projectId || !issueTypeId) return;

    const generatedDevNotes =
      typeof devNotes === 'string' ? devNotes : await devNotes?.();

    postIssue({
      title,
      projectId,
      issueTypeId,
      description,
      devNotes: generatedDevNotes,
    });
  };

  return { issue: issueRes?.data, submitToJIRA, isAttaching };
};
