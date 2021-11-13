import { View, Dimensions } from 'react-native';
import React, { forwardRef, useCallback, useState, useRef } from 'react';

import { JSONTree } from './Preview.styles';

import type { ILogs } from '../../../../contexts';
import { Typography, ScreenshotPreview, Box, Alert } from '../../../../ui';
import {
  mergeRefs,
  IUploadFile,
  fromBase64,
  getCurrentReduxState,
} from '../../../../../utils';

interface IFilePreviewProps {
  file: IUploadFile;
  updateNavigationView: () => void;
}

const { height } = Dimensions.get('screen');

export const FilePreview = forwardRef<View, IFilePreviewProps>(
  ({ file, updateNavigationView }, ref) => {
    const [minHeight, setMinHeight] = useState<number>(0);
    const viewRef = useRef<View>(null);

    const render = useCallback(() => {
      if (file.filetype.toLowerCase().startsWith('image')) {
        return <ScreenshotPreview uri={`file://${file.filepath}`} />;
      }

      if (!file.content) {
        return <Alert alert="File not supported" />;
      }

      if (file.filetype.toLowerCase().startsWith('logs')) {
        return ((file.content as unknown) as ILogs[]).map(
          ({ timestamp, level, message }) => (
            <Typography
              color={(() => {
                switch (level) {
                  case 'error':
                    return 'brandDanger';
                  case 'debug':
                    return 'brandMuted';
                  default:
                    return 'brandSecondary';
                }
              })()}
            >
              {timestamp} - {level.toUpperCase()} - {message}
            </Typography>
          )
        );
      }

      if (Array.isArray(file.content)) {
        return <ScreenshotPreview uri={file.content} />;
      }

      if (file.filetype.toLowerCase().startsWith('text')) {
        return <Typography>{fromBase64(file.content).trim()}</Typography>;
      }

      if (file.filetype.toLowerCase().startsWith('application/json')) {
        return (
          <Box onTouchEnd={updateNavigationView}>
            <JSONTree
              hideRoot
              data={
                file.name === 'state.json'
                  ? getCurrentReduxState()
                  : JSON.parse(fromBase64(file.content))
              }
            />
          </Box>
        );
      }

      return <Alert alert="File not supported" />;
    }, [file]);

    return (
      <Box
        ref={mergeRefs(ref, viewRef)}
        px="8px"
        pb="8px"
        minHeight={minHeight}
        onTouchEnd={updateNavigationView}
        onLayout={() => {
          viewRef.current?.measureInWindow((_x, y) => {
            if (height < y) return;

            setMinHeight(height - y - 50);
          });
        }}
      >
        {render()}
      </Box>
    );
  }
);
