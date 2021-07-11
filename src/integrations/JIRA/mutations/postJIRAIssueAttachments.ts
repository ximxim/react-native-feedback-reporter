import { JIRAApi } from '../JIRAApi.service';
import { uploadFiles, IUploadFile } from '../../../utils';

interface IPostJIRAIssueAttachmentsProps {
  key: string;
  filesToUpload: IUploadFile[];
}

export const postJIRAIssueAttachents = async ({
  key,
  filesToUpload,
}: IPostJIRAIssueAttachmentsProps) => {
  return await uploadFiles({
    files: filesToUpload,
    toUrl: `${JIRAApi.defaults.baseURL}issue/${key}/attachments`,
    headers: {
      ...JIRAApi.defaults.headers.common,
      'X-Atlassian-Token': 'no-check',
    },
  });
};
