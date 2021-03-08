import { JIRAApi } from '../JIRAApi.service';

interface IAllJIRAIssueTypesResponse {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  untranslatedName: string;
  subtask: boolean;
  avatarId: number;
}

export const getJIRAIssueTypes = () =>
  JIRAApi.get<IAllJIRAIssueTypesResponse[]>('issuetype');
