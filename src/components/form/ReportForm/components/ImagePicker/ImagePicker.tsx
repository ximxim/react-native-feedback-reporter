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
  defaultValue?: IFile;
  onChange?: (value: IFile) => void;
}> = ({ defaultValue, onChange }) => {
  const [value, setValue] = useState<IFile | undefined>(defaultValue);

  useEffect(() => {
    if (!value) return;
    onChange?.(value);
  }, [value]);

  return (
    <TouchableOpacity
      onPress={async () => {
        const {
          mime: filetype,
          path: filepath,
          filename,
        } = await RNImagePicker.openPicker({});

        if (filename) {
          setValue({ name: 'file', filename, filepath, filetype });
        }
      }}
    >
      <Preview
        resizeMode={value ? 'stretch' : 'cover'}
        source={{
          uri:
            value?.filepath ||
            'https://thumbs.dreamstime.com/b/screenshot-icon-black-gray-background-vector-illustration-127971141.jpg',
        }}
      />
    </TouchableOpacity>
  );
};
