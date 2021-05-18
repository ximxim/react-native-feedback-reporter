import { JIRAApi } from '../JIRAApi.service';

interface IJIRASelfResponse {
  self: string;
  accountId: string;
  emailAddress: string;
  avatarUrls: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
  displayName: string;
  active: boolean;
  timeZone: string;
  locale: string;
  groups: {
    size: number;
    items: unknown[];
  };
  applicationRoles: {
    size: number;
    items: unknown[];
  };
  expand: string;
}

export const getJIRASelf = () => JIRAApi.get<IJIRASelfResponse>('myself');
