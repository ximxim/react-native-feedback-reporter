import { useFormContext } from 'react-hook-form';
import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { FlatList } from 'react-native';

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
  SubmissionOrderEnum,
  IScreens,
} from './ReportForm.types';
import * as Styled from './ReportForm.style';

import { useJIRAIntegration, useSlackIntegration } from '../../../integrations';
import { Typography } from '../../ui';
import { GlobalProps } from '../../contexts';
import type { IFile } from '../../../utils';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  handleClose,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const formOrder: FormOrderEnum[] = [
    FormOrderEnum.Title,
    FormOrderEnum.Description,
    FormOrderEnum.SlackSwitch,
    FormOrderEnum.SlackChannelsSelector,
    FormOrderEnum.JIRASwitch,
    FormOrderEnum.JIRAProjects,
    FormOrderEnum.JIRAIssueTypes,
    FormOrderEnum.ScreenShotAndExternalSource,
  ];
  const submissionOrder: SubmissionOrderEnum[] = [
    SubmissionOrderEnum.Reporting,
    SubmissionOrderEnum.Jira,
    SubmissionOrderEnum.Slack,
  ];
  const [files, setFiles] = useState<IFile[]>([]);
  const {
    JIRAComponents,
    submitToJIRA,
    JIRAConfirmationComponents,
  } = useJIRAIntegration();
  const {
    submitToSlack,
    slackComponents,
    slackConfirmationComponents,
  } = useSlackIntegration();
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

  const disableReporting = !submitToSlack && !submitToJIRA;

  const Submit = (
    <BottomButton
      label={disableReporting ? 'Unable to report' : 'Report'}
      disabled={disableReporting}
      isLoading={formState.isSubmitting}
      onPress={handleSubmit(() => {
        submitToJIRA?.(files);
        submitToSlack?.(files);
        flatListRef.current?.scrollToIndex({ index: 1 });
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

  const submissionComponents: Record<SubmissionOrderEnum, ReactNode> = {
    [SubmissionOrderEnum.Reporting]: (
      <Typography variant="h1" textAlign="center" my="30">
        Thank you!
      </Typography>
    ),
    ...JIRAConfirmationComponents,
    ...slackConfirmationComponents,
  };

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

  const data: IScreens[] = [
    { stickyFooter: Submit, components: formComponents, order: formOrder },
    {
      stickyFooter: Done,
      components: submissionComponents,
      order: submissionOrder,
    },
  ];

  return (
    <FlatList
      horizontal
      data={data}
      pagingEnabled
      ref={flatListRef}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      renderItem={({
        item: { components, order, ...keyboardAvoidingScrollView },
      }) => (
        <Styled.Wrapper {...keyboardAvoidingScrollView}>
          {order.map((key: keyof typeof components) => components[key])}
        </Styled.Wrapper>
      )}
    />
  );
};
