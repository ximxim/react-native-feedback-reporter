import React, { FunctionComponent } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Dimensions } from 'react-native';
import RNImagePicker from 'react-native-image-crop-picker';

import { metrics } from '../../../../../utils';

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
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  console.log(value);
  return (
    <TouchableOpacity
      onPress={async () => {
        const image = await RNImagePicker.openPicker({});
        console.log(image);
        image.sourceURL && onChange(image.path);
      }}
    >
      <Preview
        resizeMode={value ? 'stretch' : 'cover'}
        source={{
          uri:
            value ||
            'https://thumbs.dreamstime.com/b/screenshot-icon-black-gray-background-vector-illustration-127971141.jpg',
        }}
      />
    </TouchableOpacity>
  );
};
