import React, { FunctionComponent, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';

import type { IReportFormProps, IReportFormValues } from './ReportForm.types';
import * as Styled from './ReportForm.style';
import { ProjectSelector, IssueTypeSelector, Description } from './components';

import {
  ScreenshotPreview,
  ModalHeader,
  BottomWrapper,
  ButtonWithLabel,
} from '../../ui';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  handleClose,
}) => {
  const {
    register,
    unregister,
    watch,
    handleSubmit,
  } = useFormContext<IReportFormValues>();

  useEffect(() => {
    register({ name: 'description' });
    register({ name: 'project' });
    register({ name: 'issueType' });

    return () => unregister(['description', 'project', 'issueType']);
  }, [register]);

  const Submit = (
    <BottomWrapper>
      <ButtonWithLabel onPress={handleSubmit(() => {})}>Report</ButtonWithLabel>
    </BottomWrapper>
  );

  return (
    <Styled.Wrapper>
      <KeyboardAvoidingScrollView stickyFooter={Submit}>
        <ModalHeader
          heading={'Wanna talk about it?'}
          right={{ label: 'Close', onPress: handleClose }}
        />

        <ScreenshotPreview uri={`data:image/png;base64,${watch('uri')}`} />
        <Description />

        {/* JIRA CONTROLS */}
        <ProjectSelector />
        <IssueTypeSelector />
      </KeyboardAvoidingScrollView>
    </Styled.Wrapper>
  );
};
