/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-escape */
import { NativeModules } from 'react-native';

import { toBase64 } from './Base64.util';
import { getExportContent } from './Redux.util';
import type { IUploadFile } from './UploadFiles.util';
import type { DevNotesType, IAddLogProps } from '../components';

const module = NativeModules.FeedbackReporter;
const reduxStatePath = module.TemporaryDirectoryPath + '/state.json';
const devNotesPath = module.TemporaryDirectoryPath + '/devnotes.txt';

export interface IFile {
  name: string;
  content?: string;
  filename: string;
  filepath: string;
  filetype: string;
  friendlyName?: string;
}

interface IWriteFilesProps {
  files: IFile[];
  devNotes?: DevNotesType;
  skipRedux?: boolean;
  addLog: (props: IAddLogProps) => void,
}

export const writeFiles = async ({
  files,
  devNotes = '',
  skipRedux = false,
  addLog,
}: IWriteFilesProps): Promise<IUploadFile[]> => {
  addLog({ level: 'info', message: 'Starting to write files' });
  const filesToUpload = files.map(({ filepath, ...file }) => ({
    ...file,
    filepath: filepath.startsWith('file://')
      ? filepath.replace('file://', '')
      : filepath,
  }));

  /**
   * REDUX STATE ATTACHMENT
   */
  try {
    addLog({ level: 'debug', message: 'Generating redux content' });
    const reduxContent = toBase64(getExportContent());

    if (reduxContent && !skipRedux) {
      addLog({ level: 'debug', message: 'Writing redux file' });
      await module.writeFile(reduxStatePath, reduxContent, {
        encoding: 'base64',
      });
      const reduxStateFile: IFile = {
        content: reduxContent,
        name: 'file',
        filename: 'state.json',
        filepath: reduxStatePath,
        filetype: 'application/json',
        friendlyName: 'Redux State',
      };
      addLog({ level: 'debug', message: 'Successfully wrote redux file' });
      filesToUpload.push(reduxStateFile);
    }
  } catch (ex) {
    addLog({ level: 'error', message: 'Failed to write redux file' });
    addLog({ level: 'error', message: (ex as string) });
  }

  /**
   * DEV NOTES ATTACHMENT
   */
  try {
    addLog({ level: 'debug', message: 'Generating dev notes content' });
    const generatedDevNotes =
      typeof devNotes === 'string' ? devNotes : await devNotes?.();
    const devNotesContent = toBase64(generatedDevNotes);

    if (devNotesContent) {
      addLog({ level: 'debug', message: 'Writing dev notes file' });
      await module.writeFile(devNotesPath, devNotesContent, {
        encoding: 'base64',
      });
      const devNotesFile: IFile = {
        content: devNotesContent,
        name: 'file',
        filename: 'devnotes.txt',
        filepath: devNotesPath,
        filetype: 'text/plain',
        friendlyName: 'Developer Notes',
      };
      addLog({ level: 'debug', message: 'Successfully wrote dev notes files' });
      filesToUpload.push(devNotesFile);
    }
  } catch (ex) {
    addLog({ level: 'error', message: 'Failed to write dev notes file' });
    addLog({ level: 'error', message: (ex as string) });
  }

  /**
   * WRITE FILES TO CACHE
   */
  await Promise.all(
    files
      .filter((file) => !!file.content)
      .map((file) => {
        try {
          addLog({ level: 'debug', message: `Writing ${file.filename}` });
          return module.writeFile(file.filepath, file.content, {
            encoding: 'base64',
          });
        } catch (ex) {
          addLog({ level: 'error', message: `Failed to write ${file.filename}` });
          addLog({ level: 'error', message: (ex as string) });
        }
      })
  );

  addLog({ level: 'info', message: 'Done writing files' });
  return filesToUpload;
};
