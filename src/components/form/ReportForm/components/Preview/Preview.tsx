import { FlatList, StyleSheet } from 'react-native';
import React, { FunctionComponent, useCallback } from 'react';

import { MainPreview } from './MainPreview';
import { FilePreview } from './FilePreview';
import type { IPreviewTab, IPreviewProps } from './Preview.types';

import { Box, Tab } from '../../../../ui';
import { useNavigation } from '../../../../../hooks';
import type { IUploadFile } from '../../../../../utils';

export const Preview: FunctionComponent<IPreviewProps> = ({
  files,
  setFiles,
  filesToUpload,
}) => {
  const data: IPreviewTab[] = [
    { name: 'Preview' },
    ...filesToUpload
      .filter((file) => file.preview)
      .map((file) => ({ ...file, name: file.filename })),
  ];
  const PreviewComp = useCallback(
    (ref: any) => <MainPreview ref={ref} {...{ files, setFiles }} />,
    []
  );
  const FileViewer = useCallback(
    (file: IUploadFile) => (ref: any) => <FilePreview ref={ref} file={file} />,
    []
  );
  const previewComponents = data.map((integration) => ({
    component:
      integration.name === 'Preview'
        ? PreviewComp
        : FileViewer(integration as IUploadFile),
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
