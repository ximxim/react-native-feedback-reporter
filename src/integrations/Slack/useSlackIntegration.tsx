import { useFormContext } from 'react-hook-form';
import React, { useContext, useEffect } from 'react';

import { useSlackSubmission } from './useSlackSubmission.hook';

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
  const { submitToSlack, ts, isAttaching } = useSlackSubmission();
  const { slack } = useContext(GlobalProps);
  const { formState } = useFormContext<IReportFormValues>();

  useEffect(() => {
    if (!slack) return;
    initSlackApi(slack);
  }, [slack]);

  const slackComponents = {
    [FormOrderEnum.SlackSwitch]: (
      <Switch onChange={console.log} label="Enable slack integration" />
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

  return {
    submitToSlack,
    slackComponents,
    slackFailureComponents,
    slackConfirmationComponents: {
      [SubmissionOrderEnum.Slack]: slackConfirmationComponents,
    },
    isSlackMessageCreated: !!ts,
  };
};
