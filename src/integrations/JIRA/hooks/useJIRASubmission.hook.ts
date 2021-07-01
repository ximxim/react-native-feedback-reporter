import { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMutation } from 'react-query';

import { postJIRAIssue, postJIRAIssueAttachents } from '../mutations';

import type { IFile } from '../../../utils';
import { useCreatePackage } from '../../../hooks';
import { IReportFormValues, GlobalProps } from '../../../components';

export const useJIRASubmission = () => {
  const [files, setFiles] = useState<IFile[]>([]);
  const { createPackage } = useCreatePackage({ files });
  const { mutate: postIssue, data: issueRes } = useMutation(postJIRAIssue);
  const { mutate: postIssueAttachments, isLoading: isAttaching } = useMutation(
    postJIRAIssueAttachents
  );
  const { getValues } = useFormContext<IReportFormValues>();
  const { jira } = useContext(GlobalProps);

  useEffect(() => {
    // TODO: handle ticket creation failure
    if (!issueRes?.data.key || !jira) return;
    (async () => {
      const filesToUpload = await createPackage();

      postIssueAttachments({
        filesToUpload,
        key: issueRes.data.key,
      });
    })();
  }, [issueRes]);

  const submitToJIRA = async (fs: IFile[]) => {
    if (!jira) return;

    setFiles(fs);
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
    });
  };

  return { issue: issueRes?.data, submitToJIRA, isAttaching };
};
