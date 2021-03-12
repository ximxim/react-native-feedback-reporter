import { NativeModules } from 'react-native';

import { uploadFiles, toBase64 } from '../../../utils';
import type { IFile } from '../../../utils';

interface IPostJIRAIssueAttachmentsProps {
  content?: string;
  username: string;
  token: string;
  key: string;
  domain: string;
  files: IFile[];
}

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

export const postJIRAIssueAttachents = ({
  content,
  username,
  token,
  key,
  domain,
  files,
}: IPostJIRAIssueAttachmentsProps) =>
  uploadFiles({
    toUrl: `${domain}/rest/api/3/issue/${key}/attachments`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${toBase64(`${username}:${token}`)}`,
      'X-Atlassian-Token': 'no-check',
    },
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
