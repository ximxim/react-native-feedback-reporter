import { useContext, useState, useEffect } from 'react';
import { NativeModules } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { writeFiles, IUploadFile } from '../utils';
import { useZipBreadcrumbs } from './useZipBreadcrumbs';
import { GlobalProps, IReportFormValues } from '../components';

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

export const useCreatePackage = () => {
  const [files, setFiles] = useState<IUploadFile[]>([]);
  const { devNotes } = useContext(GlobalProps);
  const { getValues } = useFormContext<IReportFormValues>();
  const { uri: content } = getValues();
  const createZipBreadcrumbs = useZipBreadcrumbs();

  const createPackage = async () => {
    const breadcrumbsFilePath = await createZipBreadcrumbs();
    const filesToUpload = await writeFiles({
      files: [
        ...files,
        {
          content,
          name: 'file',
          filename,
          filepath,
          filetype: 'image/png',
        },
      ],
      devNotes,
    });

    setFiles([
      ...filesToUpload,
      {
        name: 'file',
        filepath: breadcrumbsFilePath,
        filename: 'breadcrumbs.zip',
        filetype: 'zip',
      },
    ]);
  };

  useEffect(() => {
    createPackage();
  }, []);

  return { filesToUpload: files, setFilesToUpload: setFiles };
};
