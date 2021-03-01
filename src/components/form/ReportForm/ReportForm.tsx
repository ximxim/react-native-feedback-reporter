import { View, Image, Text } from 'react-native';
import React, { FunctionComponent } from 'react';

import type { IReportFormProps } from './ReportForm.types';

import { DropListPicker } from '../../data';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  getValues,
}) => {
  const ScreenShotImage = (
    <Image
      source={{ uri: `data:image/png;base64,${getValues('uri')}` }}
      style={{
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: 'red',
        width: 250,
        height: 500,
      }}
    />
  );

  return (
    <View>
      <Text>Wanna talk about it?</Text>
      {ScreenShotImage}
      <DropListPicker
        options={[
          { key: 'one', value: 'One' },
          { key: 'two', value: 'Two' },
          { key: 'three', value: 'Three' },
        ]}
        onChange={console.log}
      />
    </View>
  );
};
