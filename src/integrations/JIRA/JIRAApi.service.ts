import axios, { AxiosInstance } from 'axios';
import type { JIRAIntegrationProps } from './JIRA.types';

import { toBase64 } from '../../utils';

export const JIRAApi: AxiosInstance = axios.create({
  baseURL: 'https://ximxim.atlassian.net/rest/api',
});

export const setJIRAApiHeaders = ({
  username,
  token,
}: JIRAIntegrationProps) => {
  JIRAApi.defaults.headers.common = {
    Accept: 'application/json',
    Authorization: `Basic ${toBase64(`${username}:${token}`)}`,
  };
};
