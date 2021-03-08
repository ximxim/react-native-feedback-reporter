import axios, { AxiosInstance } from 'axios';
import type { JIRAIntegrationProps } from './JIRA.types';

import { toBase64 } from '../../utils';

export const JIRAApi: AxiosInstance = axios.create();

export const initJIRAApi = ({
  token,
  domain,
  username,
}: JIRAIntegrationProps) => {
  JIRAApi.defaults.baseURL = `${domain}/rest/api/3/`;
  JIRAApi.defaults.headers.common = {
    Accept: 'application/json',
    Authorization: `Basic ${toBase64(`${username}:${token}`)}`,
  };
};
