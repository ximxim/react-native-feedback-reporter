import { useFormContext } from 'react-hook-form';
import { LayoutAnimation, View } from 'react-native';
import React, { useContext, useEffect, useCallback } from 'react';

import { SlackChannelsSelector } from './components';
import { useSlackSubmission } from './useSlackSubmission.hook';
import { useSlackChannels, useSlackSwitch } from './hooks';
import { SlackComponents as SlackComponentsEnum } from './Slack.types';

import { initSlackApi } from './slackApi.service';
import {
  Alert,
  Typography,
  GlobalProps,
  IReportFormValues,
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
  const order = slack?.order || [
    SlackComponentsEnum.SlackSwitch,
    SlackComponentsEnum.SlackChannelsSelector,
  ];

  useEffect(() => {
    if (!slack) return;
    initSlackApi(slack);
  }, [slack]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isEnabled]);

  const components = {
    [SlackComponentsEnum.SlackSwitch]: Switch,
    [SlackComponentsEnum.SlackChannelsSelector]: isEnabled && (
      <SlackChannelsSelector options={slackChannels} />
    ),
  };

  const slackComponents = useCallback(
    (ref: any) => <View ref={ref}>{order.map((key) => components[key])}</View>,
    [components]
  );

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
    isSlackEnabled: isEnabled,
    slackConfirmationComponents: {
      [SubmissionOrderEnum.Slack]: slackConfirmationComponents,
    },
    isSlackMessageCreated: !!ts,
  };
};
