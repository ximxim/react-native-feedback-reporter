import { useFormContext } from 'react-hook-form';
import React, { FunctionComponent, useEffect } from 'react';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';

import { Description, Title } from './components';
import type { IReportFormProps, IReportFormValues } from './ReportForm.types';

import { useJIRAIntegration } from '../../../integrations';
import {
  BottomWrapper,
  ButtonWithLabel,
  ScreenshotPreview,
  Typography,
} from '../../ui';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  handleClose,
}) => {
  const {
    JIRAComponents,
    submitToJIRA,
    JIRAConfirmationComponents,
  } = useJIRAIntegration();
  const {
    register,
    unregister,
    watch,
    handleSubmit,
    formState,
    reset,
  } = useFormContext<IReportFormValues>();

  useEffect(() => {
    register({ name: 'description' });
    register({ name: 'title' });

    return () => unregister(['description', 'title']);
  }, [register]);

  const Submit = (
    <BottomWrapper>
      <ButtonWithLabel
        isLoading={formState.isSubmitting}
        onPress={handleSubmit(async () => {
          await Promise.all([submitToJIRA()]);
        })}
      >
        Report
      </ButtonWithLabel>
    </BottomWrapper>
  );

  const Done = (
    <BottomWrapper>
      <ButtonWithLabel
        onPress={() => {
          handleClose();
          reset();
        }}
      >
        Done
      </ButtonWithLabel>
    </BottomWrapper>
  );

  if (formState.isSubmitted) {
    return (
      <KeyboardAvoidingScrollView
        stickyFooter={Done}
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Typography variant="h1">Thank you!</Typography>

        <Typography variant="body1" pb={30} px={30} textAlign="center">
          Your feedback has been sent. We will be in touch and contact you soon!
        </Typography>

        {JIRAConfirmationComponents}
      </KeyboardAvoidingScrollView>
    );
  }

  return (
    <KeyboardAvoidingScrollView stickyFooter={Submit}>
      <ScreenshotPreview uri={`data:image/png;base64,${watch('uri')}`} />
      <Title />
      <Description />
      {JIRAComponents}
    </KeyboardAvoidingScrollView>
  );
};
