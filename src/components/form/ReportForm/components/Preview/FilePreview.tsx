import { View } from 'react-native';
import React, { forwardRef, useCallback } from 'react';

import { Typography, ScreenshotPreview } from '../../../../ui';
import type { IUploadFile } from '../../../../../utils';

interface IFilePreviewProps {
  file: IUploadFile;
}

export const FilePreview = forwardRef<View, IFilePreviewProps>(
  ({ file }, ref) => {
    const render = useCallback(() => {
      if (file.filetype.toLowerCase().startsWith('image')) {
        return <ScreenshotPreview uri={file.filepath} />;
      }

      return <Typography>File type not supported</Typography>;
    }, [file]);

    return <View ref={ref}>{render()}</View>;
  }
);
