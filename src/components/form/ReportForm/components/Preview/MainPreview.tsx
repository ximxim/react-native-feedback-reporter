import { useFormContext } from 'react-hook-form';
import React, { forwardRef, useContext } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

import * as Styled from './Preview.styles';

import { ScreenshotPreview } from '../../../../ui';
import { GlobalProps } from '../../../../contexts';
import type { IReportFormValues } from '../../ReportForm.types';
import { ImageAttachments, IImageAttachmentsProps } from '../ImageAttachments';

interface IMainPreviewProps extends IImageAttachmentsProps {
  onLongPress?: () => void;
}

export const MainPreview = forwardRef<View, IMainPreviewProps>(
  ({ files, setFiles, onLongPress }, ref) => {
    const { watch } = useFormContext<IReportFormValues>();
    const { extraSource } = useContext(GlobalProps);

    return (
      <TouchableWithoutFeedback onLongPress={onLongPress} delayLongPress={2000}>
        <Styled.ScreenShotWrapper ref={ref}>
          <ScreenshotPreview uri={`data:image/png;base64,${watch('uri')}`} />
          {extraSource === 'react-native-image-crop-picker' && (
            <ImageAttachments {...{ files, setFiles }} />
          )}
        </Styled.ScreenShotWrapper>
      </TouchableWithoutFeedback>
    );
  }
);
