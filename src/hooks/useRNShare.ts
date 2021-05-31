import { useContext, useCallback, useEffect } from 'react';
import { NativeModules } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { writeFiles, IFile } from '../utils';
import { GlobalProps, IReportFormValues } from '../components';

interface IUseRNShareProps {
  files: IFile[];
}

const module = NativeModules.FeedbackReporter;
const filename = 'screenshot.png';
const filepath = `${module.TemporaryDirectoryPath}/${filename}`;

export const useRNShare = ({ files }: IUseRNShareProps) => {
  const { setModalHeaderLeftState, devNotes } = useContext(GlobalProps);
  const { getValues } = useFormContext<IReportFormValues>();
  const handleShare = useCallback(async () => {
    const { uri: content } = getValues();
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
    const Share = require('react-native-share').default;
    Share.open({
      title: 'Share file',
      failOnCancel: false,
      message: 'React Native Feedback Reporter',
      urls: filesToUpload.map((file) => `file://${file.filepath}`),
    });
  }, [files]);

  useEffect(() => {
    const isRNShareEnabled = Object.keys(NativeModules).includes('RNShare');
    if (!isRNShareEnabled) return;

    setModalHeaderLeftState({
      label: 'Share',
      onPress: handleShare,
    });
  }, [NativeModules]);
};
