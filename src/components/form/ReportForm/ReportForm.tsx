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
  SubmissionTitle,
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

import type { IFile } from '../../../utils';
import { GlobalProps } from '../../contexts';
import { useJIRAIntegration, useSlackIntegration } from '../../../integrations';

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
    FormOrderEnum.JIRAAccountLinking,
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
        flatListRef.current?.scrollToIndex({
          index: data.findIndex((item) => item.name === 'submission'),
        });
      })}
    />
  );

  const Done = <BottomButton label="Done" onPress={handleClose} />;

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

  const submissionComponents: Record<SubmissionOrderEnum, ReactNode> = {
    [SubmissionOrderEnum.Reporting]: <SubmissionTitle />,
    ...JIRAConfirmationComponents,
    ...slackConfirmationComponents,
  };

  const data: IScreens[] = [
    {
      stickyFooter: Submit,
      components: formComponents,
      order: formOrder,
      name: 'bugReport',
    },
    {
      stickyFooter: Done,
      components: submissionComponents,
      order: submissionOrder,
      name: 'submission',
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
