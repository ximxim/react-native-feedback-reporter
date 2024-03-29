import { useFormContext } from 'react-hook-form';
import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useMemo,
} from 'react';
import { ScrollView } from 'react-native';

import {
  Title,
  Integrations,
  Description,
  BottomButton,
  Attachments,
  SubmissionTitle,
  Preview,
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

import type { IFile } from '../../..//utils';
import { GlobalProps } from '../../contexts';
import { useStorage, useRNShare, useCreatePackage } from '../../../hooks';
import { useJIRAIntegration, useSlackIntegration } from '../../../integrations';

export const ReportForm: FunctionComponent<IReportFormProps> = ({
  handleClose,
}) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const { setItem, getItem } = useStorage({
    key: 'FEEDBACK_REPORTER_AUTH_STATE',
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    filesToUpload: allFilesToUpload,
    setFilesToUpload,
  } = useCreatePackage({ files });
  const filesToUpload = useMemo(
    () => allFilesToUpload.filter((f) => !f.exempt),
    [allFilesToUpload]
  );
  useRNShare({ filesToUpload });
  const {
    JIRAComponents,
    submitToJIRA,
    isJIRALoading,
    isJIRAEnabled,
    isJIRAUploadDone,
    JIRAConfirmationComponents,
  } = useJIRAIntegration();
  const {
    submitToSlack,
    slackComponents,
    isSlackEnabled,
    isSlackLoading,
    isSlackUploadDone,
    slackConfirmationComponents,
  } = useSlackIntegration();
  const {
    register,
    unregister,
    handleSubmit,
    formState,
    getValues,
  } = useFormContext<IReportFormValues>();
  const {
    additionalInformation,
    authState,
    setAuthState,
    setIsBusy,
  } = useContext(GlobalProps);
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

      if (!newState) return;

      setAuthState(JSON.parse(newState));
    })();
  }, []);

  useEffect(() => {
    if (!formState.isSubmitted) return;

    if (isJIRAEnabled && !isJIRAUploadDone) return;

    if (isSlackEnabled && !isSlackUploadDone) return;

    setIsBusy(false);
  }, [
    isJIRAEnabled,
    isSlackEnabled,
    isJIRAUploadDone,
    isSlackUploadDone,
    formState.isSubmitted,
  ]);

  const disableReporting = !submitToSlack && !submitToJIRA;

  const Submit = (
    <BottomButton
      label={disableReporting ? 'Unable to report' : 'Report'}
      disabled={disableReporting}
      isLoading={formState.isSubmitting || isJIRALoading || isSlackLoading}
      onPress={handleSubmit(async () => {
        setIsBusy(true);
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
      <Preview {...{ files, setFiles, allFilesToUpload }} />
    ),
    [FormOrderEnum.Integrations]: (
      <Integrations
        enabledIntegrationsCount={enabledIntegrationsCount}
        components={{
          [IntegrationsEnum.Attachments]: (ref: any) => (
            <Attachments
              ref={ref}
              {...{ allFilesToUpload, setFilesToUpload }}
            />
          ),
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
