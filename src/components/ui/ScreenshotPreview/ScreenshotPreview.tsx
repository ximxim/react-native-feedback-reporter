import React, { FunctionComponent } from 'react';

import * as Styled from './ScreenshotPreview.style';
import type { IScreenshotPreviewProps } from './ScreenshotPreview.types';

export const ScreenshotPreview: FunctionComponent<IScreenshotPreviewProps> = ({
  uri,
  ...imageProps
}) => {
  return (
    <Styled.Wrapper resizeMode="contain" {...imageProps} source={{ uri }} />
  );
};
