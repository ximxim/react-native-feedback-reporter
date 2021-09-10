import { FlatList, StyleSheet } from 'react-native';
import React, {
  FunctionComponent,
  useCallback,
  useRef,
  useEffect,
} from 'react';

import { MainPreview } from './MainPreview';
import { FilePreview } from './FilePreview';
import type { IPreviewTab, IPreviewProps } from './Preview.types';

import { Box, Tab } from '../../../../ui';
import { useNavigation } from '../../../../../hooks';
import type { IUploadFile } from '../../../../../utils';

export const Preview: FunctionComponent<IPreviewProps> = ({
  files,
  setFiles,
  allFilesToUpload,
}) => {
  const TabsRef = useRef<FlatList>(null);
  const data: IPreviewTab[] = [
    { name: 'Preview' },
    ...allFilesToUpload
      .filter((file) => file.preview)
      .map((file) => ({ ...file, name: file.filename }))
      // @ts-ignore
      .sort((a, b) => new Date(a.preview) - new Date(b.preview)),
  ];
  const PreviewComp = useCallback(
    (ref: any) => <MainPreview ref={ref} {...{ files, setFiles }} />,
    [files]
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

  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setPageNumber(data.length - 1);
      TabsRef.current?.scrollToEnd();
    })();
  }, [data.length]);

  return (
    <>
      {data.length > 1 && (
        <FlatList
          ref={TabsRef}
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
