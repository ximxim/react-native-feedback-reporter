import { useContext } from 'react';
import { NativeModules } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { IFile, writeFiles, IUploadFile } from '../utils';
import { useZipBreadcrumbs } from './useZipBreadcrumbs';
import { GlobalProps, IReportFormValues } from '../components';

interface IUseRNShareProps {
  files: IFile[];
}

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

export const useCreatePackage = ({ files }: IUseRNShareProps) => {
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

    return [
      ...filesToUpload,
      {
        name: 'file',
        filepath: breadcrumbsFilePath,
        filename: 'breadcrumbs.zip',
        filetype: 'zip',
      },
    ] as IUploadFile[];
  };

  return { createPackage };
};
