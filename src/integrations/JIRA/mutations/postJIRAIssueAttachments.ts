import { JIRAApi } from '../JIRAApi.service';

interface IPostJIRAIssueAttachmentsResponse {
  id: string;
  key: string;
  self: string;
}

export const postJIRAIssueAttachents = () =>
  JIRAApi.get<IPostJIRAIssueAttachmentsResponse>('3/issue/AP-2/attachments');
