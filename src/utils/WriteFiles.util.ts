/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-escape */
import { NativeModules } from 'react-native';

import { toBase64 } from './Base64.util';
import { getExportContent } from './Redux.util';
import type { IUploadFile } from './UploadFiles.util';

const module = NativeModules.FeedbackReporter;
const reduxStatePath = module.TemporaryDirectoryPath + '/state.json';

export interface IFile {
  name: string;
  content?: string;
  filename: string;
  filepath: string;
  filetype: string;
}

interface IWriteFilesProps {
  files: IFile[];
}

export const writeFiles = async ({ files }: IWriteFilesProps): Promise<IUploadFile[]> => {
  /**
   * REDUX STATE ATTACHMENT
   */
  const content = toBase64(getExportContent());
  const filesToUpload = files.map(({ filepath, ...file }) => ({
    ...file,
    filepath: filepath.startsWith('file://')
      ? filepath.replace('file:\/\/', '')
      : filepath,
  }));

  if (content) {
    await module.writeFile(reduxStatePath, content, {
      encoding: 'base64',
    });
    const reduxStateFile = {
      content,
      name: 'file',
      filename: 'state.json',
      filepath: reduxStatePath,
      filetype: 'application/json',
    };
    filesToUpload.push(reduxStateFile);
  }

  /**
   * WRITE FILES TO CACHE
   */
  await Promise.all(
    files
      .filter((file) => !!file.content)
      .map((file) =>
        module.writeFile(file.filepath, file.content, { encoding: 'base64' })
      )
  );

  return filesToUpload;
};
