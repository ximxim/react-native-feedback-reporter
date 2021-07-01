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
import { useStorage, useRNShare, useCreatePackage } from '../../../hooks';
import { useJIRAIntegration, useSlackIntegration } from '../../../integrations';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  handleClose,
}) => {
  const { setItem, getItem } = useStorage({
    key: 'FEEDBACK_REPORTER_AUTH_STATE',
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const [files, setFiles] = useState<IFile[]>([]);
  const { createPackage } = useCreatePackage({ files });
  useRNShare({ files });
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
  } = useFormContext<IReportFormValues>();
  const { additionalInformation, authState, setAuthState } = useContext(
    GlobalProps
  );
  const enabledIntegrationsCount = [isJIRAEnabled, isSlackEnabled].filter(
    (b) => b
  ).length;
  const formOrder: FormOrderEnum[] = [
    FormOrderEnum.Title,
    FormOrderEnum.Description,
    FormOrderEnum.Integrations,
    FormOrderEnum.ScreenShotAndExternalSource,
  ].filter((name) => {
    switch (name) {
      case FormOrderEnum.Title:
      case FormOrderEnum.Description:
        return !!enabledIntegrationsCount;
      default:
        return true;
    }
  });
  const submissionOrder: SubmissionOrderEnum[] = [
    SubmissionOrderEnum.Reporting,
    SubmissionOrderEnum.Jira,
    SubmissionOrderEnum.Slack,
  ];

  useEffect(() => {
    register({ name: 'description' });
    register({ name: 'title' });

    return () => unregister(['description', 'title']);
  }, [register]);

  useEffect(() => {
    if (!Object.keys(authState).length) return;
    setItem(authState);
  }, [authState]);

  useEffect(() => {
    (async () => {
      const newState = await getItem();
      setAuthState(JSON.parse(newState));
    })();
  }, []);

  const disableReporting = !submitToSlack && !submitToJIRA;

  const Submit = (
    <BottomButton
      label={disableReporting ? 'Unable to report' : 'Report'}
      disabled={disableReporting}
      isLoading={formState.isSubmitting}
      onPress={handleSubmit(async () => {
        const filesToUpload = await createPackage();
        submitToJIRA?.(filesToUpload);
        submitToSlack?.(filesToUpload);
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
        enabledIntegrationsCount={enabledIntegrationsCount}
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
      stickyFooter: enabledIntegrationsCount ? Submit : null,
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
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
    >
      {data.map(({ components, order, ...keyboardAvoidingScrollView }) => (
        <Styled.Wrapper
          {...keyboardAvoidingScrollView}
          containerStyle={Styled.containerStyle}
          nestedScrollEnabled
        >
          {order.map((key: keyof typeof components) => components[key])}
        </Styled.Wrapper>
      ))}
    </ScrollView>
  );
};
