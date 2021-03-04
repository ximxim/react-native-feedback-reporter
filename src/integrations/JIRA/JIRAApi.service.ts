import axios, { AxiosInstance } from 'axios';
import type { JIRAIntegrationProps } from './JIRA.types';

export const JIRAApi: AxiosInstance = axios.create({
  baseURL: 'https://ximxim.atlassian.net/rest/api',
});

export const setJIRAApiHeaders = ({
  username,
  token,
}: JIRAIntegrationProps) => {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const b64 = btoa(`${username}:${token}`);
  JIRAApi.defaults.headers.common = {
    Accept: 'application/json',
    Authorization: `Basic ${b64}`,
  };
};
