import React, { FunctionComponent, useEffect } from 'react';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';

import type { IReportFormProps } from './ReportForm.types';
import * as Styled from './ReportForm.style';
import { ProjectSelector, IssueTypeSelector } from './components';

import { ScreenshotPreview, Typography } from '../../ui';
import { TextInput } from '../../data';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  register,
  unregister,
  errors,
  setValue,
  watch,
}) => {
  useEffect(() => {
    register({ name: 'stepsToRecreate' });
    register({ name: 'intendedOutcome' });
    register({ name: 'actualOutcome' });
    register({ name: 'version' });

    return () =>
      unregister([
        'stepsToRecreate',
        'intendedOutcome',
        'actualOutcome',
        'version',
      ]);
  }, [register]);

  return (
    <Styled.Wrapper>
      <KeyboardAvoidingScrollView>
        <Typography variant="h1" textAlign="center">
          Wanna talk about it?
        </Typography>
        <ScreenshotPreview uri={`data:image/png;base64,${watch('uri')}`} />
        <TextInput
          multiline
          label="Steps to recreate"
          onChangeText={(text) =>
            setValue('stepsToRecreate', text, { shouldValidate: false })
          }
          error={errors.stepsToRecreate?.message as string}
        />
        <TextInput
          multiline
          label="Intended outcome"
          onChangeText={(text) =>
            setValue('intendedOutcome', text, { shouldValidate: false })
          }
          error={errors.intendedOutcome?.message as string}
        />
        <TextInput
          multiline
          label="Actual outcome"
          onChangeText={(text) =>
            setValue('actualOutcome', text, { shouldValidate: false })
          }
          error={errors.actualOutcome?.message as string}
        />
        <TextInput
          label="Version"
          onChangeText={(text) =>
            setValue('version', text, { shouldValidate: false })
          }
          error={errors.version?.message as string}
        />
        {/* JIRA CONTROLS */}
        <ProjectSelector />
        <IssueTypeSelector />
      </KeyboardAvoidingScrollView>
    </Styled.Wrapper>
  );
};
