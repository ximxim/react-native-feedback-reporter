import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Dimensions } from 'react-native';
import RNImagePicker from 'react-native-image-crop-picker';

import { metrics } from '../../../../../utils';
import type { IFile } from '../../../../../utils';

const { width, height } = Dimensions.get('window');

const Preview = styled.Image`
  border-radius: 4px;
  border-width: 0.5px;
  border-color: black;
  background-color: white;
  margin-bottom: ${metrics.margin}px;
  width: ${width * metrics.attachmentsPreview - metrics.margin}px;
  height: ${(height * metrics.screenShotPreview - metrics.margin * 2) / 2 -
  metrics.margin / 2}px;
`;

export const ImagePicker: FunctionComponent<{
  previewFile?: IFile;
  onChange?: (value: IFile[]) => void;
}> = ({ previewFile, onChange }) => {
  const [value, setValue] = useState<IFile[]>();

  useEffect(() => {
    if (!value) return;
    onChange?.(value);
  }, [value]);

  return (
    <TouchableOpacity
      onPress={async () => {
        const res = await RNImagePicker.openPicker({ multiple: true });
        const files = res.map(({ filename, path, mime: filetype }) => ({
          name: 'file',
          filename: filename || new Date().toString(),
          filepath: path,
          filetype,
        }));

        setValue(files);
      }}
    >
      <Preview
        resizeMode={value ? 'stretch' : 'cover'}
        source={{
          uri:
            previewFile?.filepath ||
            'https://thumbs.dreamstime.com/b/screenshot-icon-black-gray-background-vector-illustration-127971141.jpg',
        }}
      />
    </TouchableOpacity>
  );
};
