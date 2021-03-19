import { NativeModules } from 'react-native';

import { uploadFiles } from '../../../utils';
import type { IFile } from '../../../utils';
import { slackApi } from '../slack.service';

interface IPostSlackThreadAttachmentsProps {
  ts: string;
  files: IFile[];
  channel?: string;
  content?: string;
}

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

export const postSlackFile = ({
  ts,
  files,
  content,
  channel,
}: IPostSlackThreadAttachmentsProps) =>
  Promise.all(
    [
      ...files,
      {
        content,
        name: 'file',
        filename,
        filepath,
        filetype: 'image/png',
      },
    ].map((file) =>
      uploadFiles({
        toUrl: `${slackApi.defaults.baseURL}files.upload?thread_ts=${ts}&channels=${channel || 'general'}`,
        headers: slackApi.defaults.headers.common,
        files: [file],
      })
    )
  );
