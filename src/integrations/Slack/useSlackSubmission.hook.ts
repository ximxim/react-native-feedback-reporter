import { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMutation } from 'react-query';

import { postSlackFile, postSlackMessage } from './mutations';

import type { IFile } from '../../utils';
import { IReportFormValues, GlobalProps } from '../../components';

export const useSlackSubmission = () => {
  const [files, setFiles] = useState<IFile[]>([]);
  const { mutate: postMessage, data: messageRes } = useMutation(
    postSlackMessage
  );
  const { mutate: postFile, isLoading: isAttaching, data, error } = useMutation(
    postSlackFile
  );
  const { getValues } = useFormContext<IReportFormValues>();
  const { slack, devNotes } = useContext(GlobalProps);

  console.log(data);
  console.log(error);

  useEffect(() => {
    const ts = messageRes?.data.ts;

    if (!ts || !slack) return;

    const { uri: content } = getValues();

    postFile({ files, content, ts });
  }, [messageRes]);

  const submitToSlack = async (files: IFile[]) => {
    setFiles(files);

    const { title, description } = getValues();

    if (!slack) return;

    const generatedDevNotes =
      typeof devNotes === 'string' ? devNotes : await devNotes?.();

    postMessage({
      title,
      description,
      channel: slack.channel,
      devNotes: generatedDevNotes,
    });
  };

  return {
    submitToSlack,
    isAttaching,
    ts: messageRes?.data.ts,
  };
};
