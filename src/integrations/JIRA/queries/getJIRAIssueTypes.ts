import { JIRAApi } from '../JIRAApi.service';

export interface IAllIssueTypesResponse {
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
  JIRAApi.get<IAllIssueTypesResponse[]>('3/issuetype');
