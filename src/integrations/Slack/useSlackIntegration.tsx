import { useFormContext } from 'react-hook-form';
import React, { useContext, useEffect, useState } from 'react';

import { useSlackSubmission } from './useSlackSubmission.hook';

import {
  Alert,
  Typography,
  GlobalProps,
  IReportFormValues,
} from '../../components';

export const useSlackIntegration = () => {
  const { submitToSlack, ts, isAttaching } = useSlackSubmission();
  const { slack } = useContext(GlobalProps);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const {
    register,
    unregister,
    formState,
  } = useFormContext<IReportFormValues>();

  useEffect(() => {
    if (!slack) return;
  }, [slack]);

  useEffect(() => {
    register('SlackEnabled');
    setIsRegistered(true);

    return () => {
      setIsRegistered(false);
      unregister(['JIRAIssueType', 'JIRAProject']);
    };
  }, [register]);

  if (!slack) return { slackComponents: null, submitToSlack: () => {} };

  // TODO: provide enable disable component in an object
  const slackComponents = isRegistered && <Typography />;

  const JIRAConfirmationComponents = ts && (
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
    JIRAConfirmationComponents,
    isSlackMessageCreated: !!ts,
  };
};
