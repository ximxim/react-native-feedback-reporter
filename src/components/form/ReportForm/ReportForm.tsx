import React, { FunctionComponent, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';

import type { IReportFormProps, IReportFormValues } from './ReportForm.types';
import * as Styled from './ReportForm.style';
import {
  ProjectSelector,
  IssueTypeSelector,
  StepsToRecreate,
  IntendedOutcome,
  ActualOutcome,
  Version,
} from './components';

import { ScreenshotPreview, ModalHeader } from '../../ui';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  handleClose,
}) => {
  const {
    register,
    unregister,
    watch,
  } = useFormContext<IReportFormValues>();

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
        <ModalHeader
          heading={'Wanna talk about it?'}
          right={{ label: 'Close', onPress: handleClose }}
        />

        <ScreenshotPreview uri={`data:image/png;base64,${watch('uri')}`} />
        <StepsToRecreate />
        <IntendedOutcome />
        <ActualOutcome />
        <Version />

        {/* JIRA CONTROLS */}
        <ProjectSelector />
        <IssueTypeSelector />
      </KeyboardAvoidingScrollView>
    </Styled.Wrapper>
  );
};
