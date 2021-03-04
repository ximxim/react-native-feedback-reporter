import { useFormContext } from 'react-hook-form';
import React, { FunctionComponent, useEffect } from 'react';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';

import { Description } from './components';
import type { IReportFormProps, IReportFormValues } from './ReportForm.types';

import { useJIRAIntegration } from '../../../integrations';
import { BottomWrapper, ButtonWithLabel, ScreenshotPreview } from '../../ui';

export const ReportForm: FunctionComponent<IReportFormProps> = () => {
  const { JIRAComponents, submitToJIRA } = useJIRAIntegration();
  const {
    register,
    unregister,
    watch,
    handleSubmit,
    formState,
  } = useFormContext<IReportFormValues>();

  useEffect(() => {
    register({ name: 'description' });

    return () => unregister(['description']);
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

  return (
    <KeyboardAvoidingScrollView stickyFooter={Submit}>
      <ScreenshotPreview uri={`data:image/png;base64,${watch('uri')}`} />
      <Description />
      {JIRAComponents}
    </KeyboardAvoidingScrollView>
  );
};
