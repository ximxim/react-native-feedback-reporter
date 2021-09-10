import React, { FunctionComponent, useCallback } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import { IFile, metrics } from '../../../../../utils';
import { ImagePicker } from '../ImagePicker';

const { width, height } = Dimensions.get('window');

const Wrapper = styled.ScrollView`
  width: ${width * metrics.attachmentsPreview}px;
  height: ${height * metrics.screenShotPreview - metrics.margin * 2}px;
`;

export interface IImageAttachmentsProps {
  files: IFile[];
  setFiles: (val: IFile[]) => void;
}

export const ImageAttachments: FunctionComponent<IImageAttachmentsProps> = ({
  files,
  setFiles,
}) => {
  const onChange = useCallback(
    (val: IFile[]) => {
      const filteredFiles = val.filter((file) => {
        const found = files.findIndex((f) => f.filename === file.filename);
        return found === -1;
      });
      setFiles([...files, ...filteredFiles]);
    },
    [files]
  );

  return (
    <Wrapper nestedScrollEnabled>
      {files.length ? (
        files.map((file) => (
          <ImagePicker {...{ onChange }} previewFile={file} />
        ))
      ) : (
        <ImagePicker {...{ onChange }} />
      )}
    </Wrapper>
  );
};
