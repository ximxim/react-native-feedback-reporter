import axios, { AxiosInstance } from 'axios';

import type { SlackIntegrationProps } from './Slack.types';

export const slackApi: AxiosInstance = axios.create({
  baseURL: 'https://slack.com/api/',
});

export const initSlackApi = ({ botToken }: SlackIntegrationProps) => {
  slackApi.defaults.headers.common = {
    Accept: 'application/json',
    Authorization: `Bearer ${botToken}`,
  };
};
