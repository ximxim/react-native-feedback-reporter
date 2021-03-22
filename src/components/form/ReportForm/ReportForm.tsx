import { useFormContext } from 'react-hook-form';
import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';

import {
  Title,
  Description,
  BottomButton,
  ScreenShotPreview,
} from './components';
import {
  IReportFormProps,
  IReportFormValues,
  FormOrderEnum,
} from './ReportForm.types';

import { useJIRAIntegration, useSlackIntegration } from '../../../integrations';
import { Typography } from '../../ui';
import { GlobalProps } from '../../contexts';
import type { IFile } from '../../../utils';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  handleClose,
}) => {
  const formOrder: FormOrderEnum[] = [
    FormOrderEnum.Title,
    FormOrderEnum.Description,
    FormOrderEnum.ScreenShotAndExternalSource,
    FormOrderEnum.JIRAProjects,
    FormOrderEnum.JIRAIssueTypes,
  ];
  const [files, setFiles] = useState<IFile[]>([]);
  const {
    JIRAComponents,
    submitToJIRA,
    isJIRAIssueCreated,
    JIRAConfirmationComponents,
  } = useJIRAIntegration();
  const { submitToSlack, slackComponents } = useSlackIntegration();
  const {
    register,
    unregister,
    handleSubmit,
    formState,
    getValues,
  } = useFormContext<IReportFormValues>();
  const { additionalInformation } = useContext(GlobalProps);

  useEffect(() => {
    register({ name: 'description' });
    register({ name: 'title' });

    return () => unregister(['description', 'title']);
  }, [register]);

  const Submit = (
    <BottomButton
      label="Report"
      isLoading={formState.isSubmitting}
      onPress={handleSubmit(async () => {
        await Promise.all([submitToJIRA(files), submitToSlack(files)]);
      })}
    />
  );

  const Done = (
    <BottomButton
      label="Done"
      onPress={handleClose}
      isLoading={formState.isSubmitting}
    />
  );

  if (formState.isSubmitted && isJIRAIssueCreated) {
    return (
      <KeyboardAvoidingScrollView stickyFooter={Done}>
        <Typography variant="h1">Thank you!</Typography>

        <Typography variant="body1" pb={30} px={30} textAlign="center">
          Your feedback has been sent. We will be in touch and contact you soon!
        </Typography>

        {JIRAConfirmationComponents}
      </KeyboardAvoidingScrollView>
    );
  }

  const formComponents: Record<FormOrderEnum, ReactNode> = {
    [FormOrderEnum.Title]: <Title />,
    [FormOrderEnum.Description]: <Description />,
    [FormOrderEnum.AdditionalInformation]: additionalInformation?.(getValues()),
    [FormOrderEnum.ScreenShotAndExternalSource]: (
      <ScreenShotPreview {...{ files, setFiles }} />
    ),
    ...JIRAComponents,
    ...slackComponents,
  };

  return (
    <KeyboardAvoidingScrollView stickyFooter={Submit}>
      {formOrder.map((key) => formComponents[key])}
    </KeyboardAvoidingScrollView>
  );
};
