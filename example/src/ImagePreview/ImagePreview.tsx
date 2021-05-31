import React, { FunctionComponent } from 'react';
import { Dimensions, TouchableOpacity, NativeModules } from 'react-native';

const { width } = Dimensions.get('window');

import styled from 'styled-components/native';

const margin = 4;

const Preview = styled.Image`
  border-radius: 4px;
  border-width: 0.5px;
  border-color: black;
  background-color: black;
  margin-left: ${margin}px;
  margin-right: ${margin}px;
  width: ${width / 4 - margin * 2 - 2}px;
  height: ${width / 4 - margin * 2 - 2}px;
`;

export const ImagePreview: FunctionComponent<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <TouchableOpacity
    onPress={async () => {
      const ImagePicker = NativeModules.ImageCropPicker;
      const image = await ImagePicker.openPicker({});
      image.sourceURL && onChange(image.path);
    }}
  >
    <Preview
      source={{
        uri:
          value ||
          'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png',
      }}
    />
  </TouchableOpacity>
);
