import type { View } from 'react-native';
import React, { forwardRef, useCallback } from 'react';

import { JSONTree } from './Preview.styles';

import { Typography, ScreenshotPreview, Box, Alert } from '../../../../ui';
import {
  IUploadFile,
  fromBase64,
  getCurrentReduxState,
} from '../../../../../utils';

interface IFilePreviewProps {
  file: IUploadFile;
  updateNavigationView: () => void;
}

export const FilePreview = forwardRef<View, IFilePreviewProps>(
  ({ file, updateNavigationView }, ref) => {
    const render = useCallback(() => {
      if (file.filetype.toLowerCase().startsWith('image')) {
        return <ScreenshotPreview uri={file.filepath} />;
      }

      if (!file.content) {
        return <Alert alert="File not supported" />;
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

      return <Alert alert="File not supported" />;
    }, [file]);

    return (
      <Box ref={ref} px="8px" onTouchEnd={updateNavigationView}>
        {render()}
      </Box>
    );
  }
);
