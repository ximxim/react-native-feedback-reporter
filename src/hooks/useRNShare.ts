import { useContext, useCallback, useEffect } from 'react';
import Share from 'react-native-share';
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
  const { setModalHeaderLeftState } = useContext(GlobalProps);
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
    });
    Share.open({
      title: 'Share file',
      urls: filesToUpload.map((file) => `file://${file.filepath}`),
      message: 'React Native Feedback Reporter',
      failOnCancel: false,
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
