import { JIRAApi } from '../JIRAApi.service';

interface IPostJIRAIssueResponse {
  id: string;
  key: string;
  self: string;
}

export const postJIRAIssue = () =>
  JIRAApi.get<IPostJIRAIssueResponse>('3/issue');
