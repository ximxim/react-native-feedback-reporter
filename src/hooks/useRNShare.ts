import { useContext, useCallback, useEffect } from 'react';
import Share from 'react-native-share';

import type { IUploadFile } from '../utils';
import { GlobalProps } from '../components';

interface IUseRNShareProps {
  filesToUpload: IUploadFile[];
}

export const useRNShare = ({ filesToUpload }: IUseRNShareProps) => {
  const { setModalHeaderLeftState } = useContext(GlobalProps);
  const handleShare = useCallback(async () => {
    Share.open({
      title: 'Share file',
      failOnCancel: false,
      message: 'React Native Feedback Reporter',
      urls: filesToUpload.map((file) => `file://${file.filepath}`),
    });
  }, [filesToUpload]);

  useEffect(() => {
    setModalHeaderLeftState({
      label: 'Share',
      onPress: handleShare,
    });
  }, [filesToUpload]);
};
