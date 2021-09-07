import type { View } from 'react-native';
import React, { forwardRef, useCallback } from 'react';

import { JSONTree } from './Preview.styles';

import { Typography, ScreenshotPreview, Box } from '../../../../ui';
import {
  IUploadFile,
  fromBase64,
  getCurrentReduxState,
} from '../../../../../utils';

interface IFilePreviewProps {
  file: IUploadFile;
}

export const FilePreview = forwardRef<View, IFilePreviewProps>(
  ({ file }, ref) => {
    const render = useCallback(() => {
      if (file.filetype.toLowerCase().startsWith('image')) {
        return <ScreenshotPreview uri={file.filepath} />;
      }

      if (!file.content) {
        return <Typography>No content</Typography>;
      }

      if (file.filetype.toLowerCase().startsWith('text')) {
        return <Typography>{fromBase64(file.content).trim()}</Typography>;
      }

      if (file.filetype.toLowerCase().startsWith('application/json')) {
        return (
          <JSONTree
            hideRoot
            data={
              file.name === 'state.json'
                ? getCurrentReduxState()
                : JSON.parse(fromBase64(file.content))
            }
          />
        );
      }

      return <Typography>File type not supported</Typography>;
    }, [file]);

    return (
      <Box ref={ref} px="8px">
        {render()}
      </Box>
    );
  }
);