import { JIRAApi } from '../JIRAApi.service';

interface IJIRAUploadMetaResponse {
  enabled: boolean;
  uploadLimit: number;
}

export const getJIRAUploadMeta = () =>
  JIRAApi.get<IJIRAUploadMetaResponse>('attachment/meta');
