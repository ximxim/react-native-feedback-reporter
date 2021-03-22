import { useFormContext } from 'react-hook-form';
import React, { useContext, useEffect } from 'react';

import { useSlackSubmission } from './useSlackSubmission.hook';

import { initSlackApi } from './slack.service';
import {
  Alert,
  Typography,
  GlobalProps,
  IReportFormValues,
  FormOrderEnum,
} from '../../components';

export const useSlackIntegration = () => {
  const { submitToSlack, ts, isAttaching } = useSlackSubmission();
  const { slack } = useContext(GlobalProps);
  const { formState } = useFormContext<IReportFormValues>();

  useEffect(() => {
    if (!slack) return;
    initSlackApi(slack);
  }, [slack]);

  if (!slack) {
    return {
      slackComponents: {
        [FormOrderEnum.SlackSwitch]: null,
      },
      submitToSlack: () => {},
    };
  }

  const slackComponents = {
    [FormOrderEnum.SlackSwitch]: null,
  };

  const slackConfirmationComponents = ts && (
    <>
      <Typography variant="h2">Slack</Typography>
      <Typography variant="link" fontSize={22}>
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
    slackConfirmationComponents,
    isSlackMessageCreated: !!ts,
  };
};
