/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-escape */
import { NativeModules } from 'react-native';

import { toBase64 } from './Base64.util';
import { getExportContent } from './Redux.util';
import type { IUploadFile } from './UploadFiles.util';
import type { DevNotesType } from '../components';

const module = NativeModules.FeedbackReporter;
const reduxStatePath = module.TemporaryDirectoryPath + '/state.json';
const devNotesPath = module.TemporaryDirectoryPath + '/devnotes.txt';

export interface IFile {
  name: string;
  content?: string;
  filename: string;
  filepath: string;
  filetype: string;
}

interface IWriteFilesProps {
  files: IFile[];
  devNotes: DevNotesType;
}

export const writeFiles = async ({ files, devNotes }: IWriteFilesProps): Promise<IUploadFile[]> => {
  const filesToUpload = files.map(({ filepath, ...file }) => ({
    ...file,
    filepath: filepath.startsWith('file://')
      ? filepath.replace('file:\/\/', '')
      : filepath,
  }));

  /**
   * REDUX STATE ATTACHMENT
   */
  const reduxContent = toBase64(getExportContent());

  if (reduxContent) {
    await module.writeFile(reduxStatePath, reduxContent, {
      encoding: 'base64',
    });
    const reduxStateFile: IFile = {
      content: reduxContent,
      name: 'file',
      filename: 'state.json',
      filepath: reduxStatePath,
      filetype: 'application/json',
    };
    filesToUpload.push(reduxStateFile);
  }

  /**
   * DEV NOTES ATTACHMENT
   */
  const generatedDevNotes =
    typeof devNotes === 'string' ? devNotes : await devNotes?.();
  const devNotesContent = toBase64(generatedDevNotes);

  if (devNotesContent) {
    await module.writeFile(devNotesPath, devNotesContent, {
      encoding: 'base64',
    });
    const devNotesFile = {
      devNotesContent,
      name: 'file',
      filename: 'devnotes.txt',
      filepath: devNotesPath,
      filetype: 'text/plain',
    };
    filesToUpload.push(devNotesFile);
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
