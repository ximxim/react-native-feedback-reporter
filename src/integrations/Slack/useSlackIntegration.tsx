import { useFormContext } from 'react-hook-form';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutAnimation } from 'react-native';

import { SlackChannelsSelector } from './components';
import { useSlackSubmission } from './useSlackSubmission.hook';
import { useSlackChannels } from './hooks';

import { initSlackApi } from './slackApi.service';
import {
  Alert,
  Switch,
  Typography,
  GlobalProps,
  IReportFormValues,
  FormOrderEnum,
  SubmissionOrderEnum,
} from '../../components';

export const useSlackIntegration = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const slackChannels = useSlackChannels();
  const { submitToSlack, ts, isAttaching } = useSlackSubmission();
  const { slack } = useContext(GlobalProps);
  const { formState } = useFormContext<IReportFormValues>();

  useEffect(() => {
    if (!slack) return;
    initSlackApi(slack);
  }, [slack]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isEnabled]);

  const slackComponents = {
    [FormOrderEnum.SlackSwitch]: (
      <Switch onChange={setIsEnabled} label="Enable slack integration" />
    ),
    [FormOrderEnum.SlackChannelsSelector]: isEnabled && (
      <SlackChannelsSelector options={slackChannels} />
    ),
  };

  const slackConfirmationComponents = ts && (
    <>
      <Typography variant="h2" textAlign="center">
        Slack
      </Typography>
      <Typography variant="link" fontSize={22} textAlign="center">
        message sent
      </Typography>
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

  const handleSubmit = isEnabled ? submitToSlack : console.log;

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
