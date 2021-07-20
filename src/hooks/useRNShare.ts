import { useContext, useCallback, useEffect } from 'react';
import Share from 'react-native-share';

import type { IFile } from '../utils';
import { useCreatePackage } from '../hooks';
import { GlobalProps } from '../components';

interface IUseRNShareProps {
  files: IFile[];
}

export const useRNShare = ({ files }: IUseRNShareProps) => {
  const { setModalHeaderLeftState } = useContext(GlobalProps);
  const { createPackage } = useCreatePackage({ files });
  const handleShare = useCallback(async () => {
    const filesToUpload = await createPackage();

    Share.open({
      title: 'Share file',
      failOnCancel: false,
      message: 'React Native Feedback Reporter',
      urls: filesToUpload.map((file) => `file://${file.filepath}`),
    });
  }, [files]);

  useEffect(() => {
    setModalHeaderLeftState({
      label: 'Share',
      onPress: handleShare,
    });
  }, [files]);
};
