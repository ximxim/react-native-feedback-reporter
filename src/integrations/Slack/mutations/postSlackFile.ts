import { slackApi } from '../slackApi.service';
import { IFile, uploadFiles } from '../../../utils';

interface IPostSlackThreadAttachmentsProps {
  ts: string;
  filesToUpload: IFile[];
  channel?: string;
}

export const postSlackFile = async ({
  ts,
  channel,
  filesToUpload,
}: IPostSlackThreadAttachmentsProps) => {
  return uploadFiles({
    submitIndividually: true,
    toUrl: `${slackApi.defaults.baseURL}files.upload?thread_ts=${ts}&channels=${
      channel || 'general'
    }`,
    headers: slackApi.defaults.headers.common,
    files: filesToUpload,
  });
};
