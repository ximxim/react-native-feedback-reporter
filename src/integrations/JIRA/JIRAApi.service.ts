import axios, { AxiosInstance } from 'axios';
import type { JIRAIntegrationProps } from './JIRA.types';

import { toBase64 } from '../../utils';
import type { IAuthState } from '../../hooks';

export const JIRAApi: AxiosInstance = axios.create();

export const initJIRAApi = ({
  domain,
  jira,
  token: globalToken,
  username: globalUsername,
}: JIRAIntegrationProps & IAuthState) => {
  JIRAApi.defaults.baseURL = `${domain}/rest/api/3/`;
  const username = jira?.username || globalUsername;
  const token = jira?.token || globalToken;
  JIRAApi.defaults.headers.common = {
    Accept: 'application/json',
    Authorization: `Basic ${toBase64(`${username}:${token}`)}`,
  };
};
