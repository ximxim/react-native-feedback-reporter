import { NativeModules } from 'react-native';

import type { IFile } from '../utils';

const module = NativeModules.FeedbackReporter;
const zipBreadcrumbs = module.zipBreadcrumbs;
const directory = `${module.TemporaryDirectoryPath}/breadcrumbs.zip`;

export const useZipBreadcrumbs = () => {
  const handleZipBreadcrumbs = async (): Promise<IFile | undefined> => {
    try {
      const breadcrumbsFilePath = await zipBreadcrumbs(directory);
      return {
        name: 'file',
        filepath: breadcrumbsFilePath,
        filename: 'breadcrumbs.zip',
        filetype: 'zip',
      };
    } catch (ex) {
      return;
    }
  };

  return handleZipBreadcrumbs;
};
