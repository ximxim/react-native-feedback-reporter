import axios from 'axios';

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

export const getAllIssueTypes = () =>
  axios.get<IAllIssueTypesResponse[]>(
    'https://ximxim.atlassian.net/rest/api/3/issuetype'
  );
