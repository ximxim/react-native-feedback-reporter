import { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMutation } from 'react-query';

import { postJIRAIssue, postJIRAIssueAttachents } from '../mutations';

import type { IUploadFile } from '../../../utils';
import { IReportFormValues, GlobalProps } from '../../../components';

export const useJIRASubmission = () => {
  const [filesToUpload, setFilesToUpload] = useState<IUploadFile[]>([]);
  const { mutate: postIssue, data: issueRes } = useMutation(postJIRAIssue);
  const { mutate: postIssueAttachments, isLoading: isAttaching } = useMutation(
    postJIRAIssueAttachents
  );
  const { getValues } = useFormContext<IReportFormValues>();
  const { jira } = useContext(GlobalProps);

  useEffect(() => {
    // TODO: handle ticket creation failure
    if (!issueRes?.data.key || !jira) return;

    postIssueAttachments({
      filesToUpload,
      key: issueRes.data.key,
    });
  }, [issueRes]);

  const submitToJIRA = async (fs: IUploadFile[]) => {
    if (!jira) return;

    setFilesToUpload(fs);
    const {
      title,
      description,
      JIRAProject: projectId,
      JIRAIssueType: issueTypeId,
    } = getValues();

    if (!jira || !projectId || !issueTypeId) return;

    postIssue({
      title,
      projectId,
      issueTypeId,
      description,
      meta: jira.meta,
    });
  };

  return { issue: issueRes?.data, submitToJIRA, isAttaching };
};
