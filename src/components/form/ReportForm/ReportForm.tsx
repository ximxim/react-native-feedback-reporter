import { View, Text } from 'react-native';
import React, { FunctionComponent } from 'react';

import type { IReportFormProps } from './ReportForm.types';
import { ProjectSelector, IssueTypeSelector } from './components';

import { ScreenshotPreview } from '../../ui';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  getValues,
}) => {
  return (
    <View>
      <Text>Wanna talk about it?</Text>
      <ScreenshotPreview uri={`data:image/png;base64,${getValues('uri')}`} />
      <ProjectSelector />
      <IssueTypeSelector />
    </View>
  );
};
