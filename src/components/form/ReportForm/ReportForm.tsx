import { useFormContext } from 'react-hook-form';
import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from 'react';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';

import { Description, Title, ImageAttachments } from './components';
import type { IReportFormProps, IReportFormValues } from './ReportForm.types';
import * as Styled from './ReportForm.styles';

import { useJIRAIntegration, useSlackIntegration } from '../../../integrations';
import {
  BottomWrapper,
  ButtonWithLabel,
  ScreenshotPreview,
  Typography,
} from '../../ui';
import { GlobalProps } from '../../contexts';
import type { IFile } from 'src/utils';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  handleClose,
}) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const {
    JIRAComponents,
    submitToJIRA,
    isJIRAIssueCreated,
    JIRAFailureComponents,
    JIRAConfirmationComponents,
  } = useJIRAIntegration();
  const { submitToSlack } = useSlackIntegration();
  const {
    register,
    unregister,
    watch,
    handleSubmit,
    formState,
    getValues,
  } = useFormContext<IReportFormValues>();
  const { additionalInformation, extraSource } = useContext(GlobalProps);

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
          await Promise.all([submitToJIRA(files), submitToSlack(files)]);
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
        }}
      >
        Done
      </ButtonWithLabel>
    </BottomWrapper>
  );

  if (formState.isSubmitted && isJIRAIssueCreated) {
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
      {JIRAFailureComponents}
      <Title />
      <Description />
      {JIRAComponents}
      {additionalInformation?.(getValues())}
      <Styled.ScreenShotWrapper>
        <ScreenshotPreview uri={`data:image/png;base64,${watch('uri')}`} />
        {extraSource === 'react-native-image-crop-picker' && (
          <ImageAttachments {...{ files, setFiles }} />
        )}
      </Styled.ScreenShotWrapper>
    </KeyboardAvoidingScrollView>
  );
};
