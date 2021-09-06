import { useContext, useState, useEffect } from 'react';
import { NativeModules } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { writeFiles, IUploadFile, IFile } from '../utils';
import { useZipBreadcrumbs } from './useZipBreadcrumbs';
import { GlobalProps, IReportFormValues } from '../components';

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

interface IUseCreatePackageProps {
  files: IFile[];
}

export const useCreatePackage = ({ files }: IUseCreatePackageProps) => {
  const [filesToUpload, setFilesToUpload] = useState<IUploadFile[]>([]);
  const { devNotes } = useContext(GlobalProps);
  const { watch } = useFormContext<IReportFormValues>();
  const createZipBreadcrumbs = useZipBreadcrumbs();
  const content = watch('uri');

  useEffect(() => {
    if (!files.length) return;

    (async () => {
      const writtenFiles = await writeFiles({ files, skipRedux: true });
      setFilesToUpload([...filesToUpload, ...writtenFiles]);
    })();
  }, [files]);

  const createPackage = async () => {
    const breadcrumbsFilePath = await createZipBreadcrumbs();
    const writtenFiles = await writeFiles({
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

    setFilesToUpload([
      ...writtenFiles,
      {
        name: 'file',
        filepath: breadcrumbsFilePath,
        filename: 'breadcrumbs.zip',
        filetype: 'zip',
      },
    ]);
  };

  useEffect(() => {
    if (!content) return;

    createPackage();
  }, [content]);

  return { filesToUpload, setFilesToUpload };
};
