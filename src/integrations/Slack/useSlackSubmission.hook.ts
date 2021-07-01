import { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMutation } from 'react-query';

import {
  postSlackFile,
  postSlackMessage,
  postSlackConversationJoin,
} from './mutations';

import type { IUploadFile } from '../../utils';
import { IReportFormValues, GlobalProps } from '../../components';

export const useSlackSubmission = () => {
  const [filesToUpload, setFilesToUpload] = useState<IUploadFile[]>([]);
  const { data: joinConversationRes, mutate: joinConversation } = useMutation(
    postSlackConversationJoin
  );
  const { mutate: postMessage, data: messageRes } = useMutation(
    postSlackMessage
  );
  const { mutate: postFile, isLoading: isAttaching } = useMutation(
    postSlackFile
  );
  const { getValues } = useFormContext<IReportFormValues>();
  const { slack } = useContext(GlobalProps);
  const { slackChannel } = getValues();

  useEffect(() => {
    const ts = messageRes?.data.ts;

    if (!ts || !slack) return;

    (async () => {
      postFile({ filesToUpload, ts, channel: slackChannel });
    })();
  }, [messageRes]);

  useEffect(() => {
    if (!joinConversationRes?.data.ok) return;

    (async () => {
      const { title, description } = getValues();

      postMessage({
        title,
        description,
        channel: slackChannel,
      });
    })();
  }, [joinConversationRes]);

  const submitToSlack = async (files: IUploadFile[]) => {
    setFilesToUpload(files);

    if (!slack) return;

    joinConversation({ channelId: slackChannel });
  };

  return {
    submitToSlack,
    isAttaching,
    ts: messageRes?.data.ts,
  };
};
