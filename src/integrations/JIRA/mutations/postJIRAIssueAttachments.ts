import { NativeModules } from 'react-native';

import { JIRAApi } from '../JIRAApi.service';
import type { DevNotesType } from '../../../components';
import { IFile, uploadFiles, writeFiles } from '../../../utils';

interface IPostJIRAIssueAttachmentsProps {
  key: string;
  files: IFile[];
  content?: string;
  devNotes: DevNotesType;
}

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

export const postJIRAIssueAttachents = async ({
  key,
  files,
  content,
  devNotes,
}: IPostJIRAIssueAttachmentsProps) => {
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
    devNotes,
  });
  return await uploadFiles({
    files: filesToUpload,
    toUrl: `${JIRAApi.defaults.baseURL}issue/${key}/attachments`,
    headers: {
      ...JIRAApi.defaults.headers.common,
      'X-Atlassian-Token': 'no-check',
    },
  });
};
