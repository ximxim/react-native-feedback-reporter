import { useFormContext } from 'react-hook-form';
import React, { useContext, useEffect } from 'react';
import { LayoutAnimation } from 'react-native';

import { SlackChannelsSelector } from './components';
import { useSlackSubmission } from './useSlackSubmission.hook';
import { useSlackChannels, useSlackSwitch } from './hooks';

import { initSlackApi } from './slackApi.service';
import {
  Alert,
  Typography,
  GlobalProps,
  IReportFormValues,
  FormOrderEnum,
  SubmissionOrderEnum,
} from '../../components';

export const useSlackIntegration = () => {
  const slackChannels = useSlackChannels();
  const Switch = useSlackSwitch();
  const { submitToSlack, ts, isAttaching } = useSlackSubmission();
  const { slack } = useContext(GlobalProps);
  const { formState } = useFormContext<IReportFormValues>();
  const { watch } = useFormContext<IReportFormValues>();
  const isEnabled = watch('slackSwitch');

  useEffect(() => {
    if (!slack) return;
    initSlackApi(slack);
  }, [slack]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isEnabled]);

  const slackComponents = {
    [FormOrderEnum.SlackSwitch]: Switch,
    [FormOrderEnum.SlackChannelsSelector]: isEnabled && (
      <SlackChannelsSelector options={slackChannels} />
    ),
  };

  const slackConfirmationComponents = ts && (
    <>
      <Typography variant="h2" textAlign="center" my="10">
        Slack
      </Typography>
      <Typography textAlign="center">message sent</Typography>
      <Alert
        alert={
          isAttaching
            ? 'Uploading attachments in the background. Feel free to continue using the app. Dismissing this screen will not stop the uploads'
            : 'Attachments uploaded'
        }
        isLoading={isAttaching}
      />
    </>
  );

  const slackFailureComponents = ts && formState.isSubmitted && (
    <Alert
      variant="brandDanger"
      alert="Unable to create JIRA ticket. Please try again."
    />
  );

  const handleSubmit = isEnabled ? submitToSlack : null;

  return {
    submitToSlack: handleSubmit,
    slackComponents,
    slackFailureComponents,
    slackConfirmationComponents: {
      [SubmissionOrderEnum.Slack]: slackConfirmationComponents,
    },
    isSlackMessageCreated: !!ts,
  };
};
