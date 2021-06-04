import React, { FunctionComponent } from 'react';
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
  const onChange = (val: IFile[]) => setFiles(val);

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
