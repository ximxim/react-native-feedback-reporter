import { NativeModules } from 'react-native';

import { toBase64 } from './Base64.util';
import { getExportContent } from './Redux.util';

const module = NativeModules.FeedbackReporter;
const reduxStatePath = module.TemporaryDirectoryPath + '/state.json';

interface IFile {
  name: string;
  content: string;
  filename: string;
  filepath: string;
  filetype: string;
}

interface IUploadFilesProps {
  toUrl: string;
  files: IFile[];
  method?: 'POST';
  headers: Record<string, string>;
}

export const uploadFiles = async ({
  files,
  method = 'POST',
  ...props
}: IUploadFilesProps) => {
  /**
   * REDUX STATE ATTACHMENT
   */
  const content = toBase64(getExportContent());
  await module.writeFile(reduxStatePath, content, {
    encoding: 'base64',
  });
  const reduxStateFile = {
    name: 'file',
    filename: 'state.json',
    filepath: reduxStatePath,
    filetype: 'application/json',
  };

  /**
   * WRITE FILES TO CACHE
   */
  await Promise.all(
    files.map((file) =>
      module.writeFile(file.filepath, file.content, { encoding: 'base64' })
    )
  );

  /**
   * UPLOAD FILES
   */
  return await module.uploadFiles({
    files: [...files, reduxStateFile],
    method,
    jobId: 1,
    ...props,
  });
};
