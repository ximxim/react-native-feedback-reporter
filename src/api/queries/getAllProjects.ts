import axios from 'axios';

export interface IAllProjectsResponse {
  expand: string;
  self: string;
  id: string;
  key: string;
  name: string;
  avatarUrls: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
  properties: object;
}

export const getAllProjects = () =>
  axios.get<IAllProjectsResponse[]>(
    'https://ximxim.atlassian.net/rest/api/3/project'
  );
