import { NativeModules } from 'react-native';

import { slackApi } from '../slackApi.service';
import { IFile, writeFiles, uploadFiles } from '../../../utils';

interface IPostSlackThreadAttachmentsProps {
  ts: string;
  files: IFile[];
  channel?: string;
  content?: string;
}

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

export const postSlackFile = async ({
  ts,
  files,
  content,
  channel,
}: IPostSlackThreadAttachmentsProps) => {
  const filesToUpload = await writeFiles({
    files: [
      ...files,
      {
        content,
        name: 'file',
        filename,
        filepath,
        filetype: 'image/png',
      },
    ],
  });
  return await uploadFiles({
    submitIndividually: true,
    toUrl: `${slackApi.defaults.baseURL}files.upload?thread_ts=${ts}&channels=${
      channel || 'general'
    }`,
    headers: slackApi.defaults.headers.common,
    files: filesToUpload,
  });
};
