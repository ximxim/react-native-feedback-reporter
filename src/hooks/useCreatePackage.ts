import { useContext, useState, useEffect } from 'react';
import { NativeModules } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { writeFiles, IUploadFile, IFile } from '../utils';
import { useZipBreadcrumbs } from './useZipBreadcrumbs';
import { GlobalProps, IReportFormValues, Logs } from '../components';

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

interface IUseCreatePackageProps {
  files: IFile[];
}

export const useCreatePackage = ({ files }: IUseCreatePackageProps) => {
  const [filesToUpload, setFilesToUpload] = useState<IUploadFile[]>([]);
  const { devNotes } = useContext(GlobalProps);
  const { addLog } = useContext(Logs);
  const { watch } = useFormContext<IReportFormValues>();
  const createZipBreadcrumbs = useZipBreadcrumbs();
  const content = watch('uri');

  useEffect(() => {
    if (!files.length) return;

    (async () => {
      const filteredFiles = files.filter((file) => {
        const found = filesToUpload.findIndex(
          (f) => f.filename === file.filename
        );
        return found === -1;
      });
      const writtenFiles = await writeFiles({
        files: filteredFiles,
        skipRedux: true,
        addLog,
      });
      setFilesToUpload([...filesToUpload, ...writtenFiles]);
    })();
  }, [files]);

  const createPackage = async () => {
    const breadcrumbsFile = await createZipBreadcrumbs();
    const writtenFiles = await writeFiles({
      files: [
        ...files,
        {
          content,
          name: 'file',
          filename,
          filepath,
          filetype: 'image/png',
          friendlyName: 'Screenshot',
        },
      ],
      devNotes,
      addLog,
    });

    if (breadcrumbsFile) {
      writtenFiles.push(breadcrumbsFile);
    }

    setFilesToUpload(writtenFiles);
  };

  useEffect(() => {
    if (!content) return;

    createPackage();
  }, [content]);

  return { filesToUpload, setFilesToUpload };
};
