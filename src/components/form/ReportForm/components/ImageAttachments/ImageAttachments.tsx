import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import { metrics } from '../../../../../utils';
import { ImagePicker } from '../ImagePicker';

const { width, height } = Dimensions.get('window');

const Wrapper = styled.View`
  width: ${width * metrics.attachmentsPreview}px;
  height: ${height * metrics.screenShotPreview - metrics.margin * 2}px;
`;

export const ImageAttachments: FunctionComponent<unknown> = () => {
  const [files, setFiles] = useState({
    file1: '',
    file2: '',
  });

  return (
    <Wrapper>
      <ImagePicker
        value={files.file1}
        onChange={(val) => setFiles({ ...files, file1: val })}
      />
      <ImagePicker
        value={files.file2}
        onChange={(val) => setFiles({ ...files, file2: val })}
      />
    </Wrapper>
  );
};
