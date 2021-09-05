/* eslint-disable prettier/prettier */
import { NativeModules } from 'react-native';

const module = NativeModules.FeedbackReporter;

export interface IUploadFile {
  filepath: string;
  name: string;
  content?: string;
  filename: string;
  filetype: string;
  exempt?: boolean;
}

interface IUploadFilesProps {
  toUrl: string;
  method?: 'POST';
  files: IUploadFile[];
  submitIndividually?: boolean;
  headers: Record<string, string>;
}

export const uploadFiles = async ({
  files,
  method = 'POST',
  submitIndividually,
  ...props
}: IUploadFilesProps) => {
  if (submitIndividually) {
    return await Promise.all(files.map(file => module.uploadFiles({
      files: [file],
      method,
      jobId: 1,
      ...props,
    })));
  }

  return await module.uploadFiles({
    files,
    method,
    jobId: 1,
    ...props,
  });
};
