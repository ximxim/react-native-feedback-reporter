import { useFormContext } from 'react-hook-form';
import React, { FunctionComponent, useContext } from 'react';

import { ImageAttachments, IImageAttachmentsProps } from '../ImageAttachments';
import type { IReportFormValues } from '../../ReportForm.types';
import * as Styled from './ScreenShotPreview.styles';

import { GlobalProps } from '../../../../contexts';
import { ScreenshotPreview } from '../../../../ui';

interface IScreenShotPreviewProps extends IImageAttachmentsProps {}

export const ScreenShotPreview: FunctionComponent<IScreenShotPreviewProps> = ({
  files,
  setFiles,
}) => {
  const { watch } = useFormContext<IReportFormValues>();
  const { extraSource } = useContext(GlobalProps);

  return (
    <Styled.ScreenShotWrapper>
      <ScreenshotPreview uri={`data:image/png;base64,${watch('uri')}`} />
      {extraSource === 'react-native-image-crop-picker' && (
        <ImageAttachments {...{ files, setFiles }} />
      )}
    </Styled.ScreenShotWrapper>
  );
};
