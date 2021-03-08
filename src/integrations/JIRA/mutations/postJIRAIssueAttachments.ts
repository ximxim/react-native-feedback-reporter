import { NativeModules } from 'react-native';

import { uploadFiles, toBase64 } from '../../../utils';

// interface IPostJIRAIssueAttachmentsResponse {
//   id: string;
//   key: string;
//   self: string;
// }

interface IPostJIRAIssueAttachmentsProps {
  content: string;
  username: string;
  token: string;
  key: string;
}

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

export const postJIRAIssueAttachents = ({
  content,
  username,
  token,
  key,
}: IPostJIRAIssueAttachmentsProps) =>
  uploadFiles({
    toUrl: `https://ximxim.atlassian.net/rest/api/3/issue/${key}/attachments`,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${toBase64(`${username}:${token}`)}`,
      'X-Atlassian-Token': 'no-check',
    },
    files: [
      {
        content,
        name: 'file',
        filename,
        filepath,
        filetype: 'image/png',
      },
    ],
  });
