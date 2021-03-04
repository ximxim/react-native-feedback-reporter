import { JIRAApi } from '../JIRAApi.service';

interface IAllJIRAProjectsResponse {
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

export const getJIRAProjects = () =>
  JIRAApi.get<IAllJIRAProjectsResponse[]>('3/project');
