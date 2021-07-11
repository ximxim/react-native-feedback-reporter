import { NativeModules } from 'react-native';

const module = NativeModules.FeedbackReporter;
const zipBreadcrumbs = module.zipBreadcrumbs;
const directory = `${module.TemporaryDirectoryPath}/breadcrumbs.zip`;

export const useZipBreadcrumbs = () => {
  const handleZipBreadcrumbs = () => zipBreadcrumbs(directory);

  return handleZipBreadcrumbs;
};
