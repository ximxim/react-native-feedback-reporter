import { useFormContext } from 'react-hook-form';
import { FlatList, StyleSheet } from 'react-native';
import React, { FunctionComponent, useContext, useCallback } from 'react';

import { ImageAttachments } from '../ImageAttachments';
import type { IReportFormValues } from '../../ReportForm.types';
import * as Styled from './Preview.styles';
import type { IPreviewTab, IPreviewProps } from './Preview.types';

import { GlobalProps } from '../../../../contexts';
import { useNavigation } from '../../../../../hooks';
import { ScreenshotPreview, Box, Tab } from '../../../../ui';

export const Preview: FunctionComponent<IPreviewProps> = ({
  files,
  setFiles,
}) => {
  const data: IPreviewTab[] = [{ name: 'Preview' }];
  const { watch } = useFormContext<IReportFormValues>();
  const { extraSource } = useContext(GlobalProps);
  const PreviewComp = useCallback(
    (ref: any) => (
      <Styled.ScreenShotWrapper ref={ref}>
        <ScreenshotPreview uri={`data:image/png;base64,${watch('uri')}`} />
        {extraSource === 'react-native-image-crop-picker' && (
          <ImageAttachments {...{ files, setFiles }} />
        )}
      </Styled.ScreenShotWrapper>
    ),
    []
  );
  const previewComponents = data.map((integration) => ({
    component: integration.name === 'Preview' ? PreviewComp : PreviewComp,
  }));
  const { Navigation, setPageNumber, pageNumber } = useNavigation(
    { data: previewComponents },
    [data]
  );

  return (
    <>
      {data.length > 1 && (
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={style.contentContainerStyle}
          renderItem={({ item: { name, ...tabProps }, index }) => (
            <Tab
              label={name}
              isSelected={index === pageNumber}
              onPress={() => setPageNumber(index)}
              {...tabProps}
            />
          )}
        />
      )}
      <Box mt={2} />
      {Navigation}
    </>
  );
};

const style = StyleSheet.create({
  contentContainerStyle: {
    paddingLeft: 8,
  },
});
