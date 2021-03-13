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

export const ImageAttachments: FunctionComponent<{
  files: IFile[];
  setFiles: (val: IFile[]) => void;
}> = ({ files, setFiles }) => {
  const onChange = (val: IFile) => {
    console.log(val);
    setFiles([...files, val]);
  }

  return (
    <Wrapper>
      <ImagePicker {...{ onChange }} />
      {files.map(() => (
        <ImagePicker {...{ onChange }} />
      ))}
    </Wrapper>
  );
};
