import { NativeModules } from 'react-native';

import type { IFile } from '../utils';

const module = NativeModules.FeedbackReporter;
const zipBreadcrumbs = module.zipBreadcrumbs;
const directory = `${module.TemporaryDirectoryPath}/breadcrumbs.zip`;

export const useZipBreadcrumbs = () => {
  const handleZipBreadcrumbs = async (): Promise<IFile | undefined> => {
    try {
      const { path, content } = await zipBreadcrumbs(directory);
      return {
        name: 'file',
        content,
        filepath: path,
        filename: 'breadcrumbs.zip',
        filetype: 'zip',
        friendlyName: 'Breadcrumbs',
      };
    } catch (ex) {
      return;
    }
  };

  return handleZipBreadcrumbs;
};
