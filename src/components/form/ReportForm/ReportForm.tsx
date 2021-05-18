import { useFormContext } from 'react-hook-form';
import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { ScrollView } from 'react-native';

import {
  Title,
  Integrations,
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
import { IntegrationsEnum } from './components/Integrations/Integrations.types';

import type { IFile } from '../../../utils';
import { GlobalProps } from '../../contexts';
import { useJIRAIntegration, useSlackIntegration } from '../../../integrations';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  handleClose,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const formOrder: FormOrderEnum[] = [
    FormOrderEnum.Title,
    FormOrderEnum.Description,
    FormOrderEnum.Integrations,
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
    isJIRAEnabled,
    JIRAConfirmationComponents,
  } = useJIRAIntegration();
  const {
    submitToSlack,
    slackComponents,
    isSlackEnabled,
    slackConfirmationComponents,
  } = useSlackIntegration();
  const {
    register,
    unregister,
    handleSubmit,
    formState,
    getValues,
    watch,
  } = useFormContext<IReportFormValues>();
  const { additionalInformation } = useContext(GlobalProps);

  console.log(watch('uri'));

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
        const index = data.findIndex((item) => item.name === 'submission');
        scrollViewRef.current?.scrollTo({
          x: Styled.width * index,
          animated: true,
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
    [FormOrderEnum.Integrations]: (
      <Integrations
        enabledIntegrationsCount={
          [isJIRAEnabled, isSlackEnabled].filter((b) => b).length
        }
        components={{
          [IntegrationsEnum.JIRA]: JIRAComponents,
          [IntegrationsEnum.Slack]: slackComponents,
        }}
      />
    ),
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
    <ScrollView
      horizontal
      pagingEnabled
      ref={scrollViewRef}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
    >
      {data.map(({ components, order, ...keyboardAvoidingScrollView }) => (
        <Styled.Wrapper
          {...keyboardAvoidingScrollView}
          containerStyle={Styled.containerStyle}
        >
          {order.map((key: keyof typeof components) => components[key])}
        </Styled.Wrapper>
      ))}
    </ScrollView>
  );
};
