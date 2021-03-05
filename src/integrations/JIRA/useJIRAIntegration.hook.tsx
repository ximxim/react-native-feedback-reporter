import React, { useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { ProjectSelector, IssueTypeSelector } from './components';
import { setJIRAApiHeaders } from './JIRAApi.service';

import { GlobalProps, IReportFormValues } from '../../components';

export const useJIRAIntegration = () => {
  const { jira } = useContext(GlobalProps);

  const {
    register,
    getValues,
    unregister,
  } = useFormContext<IReportFormValues>();

  useEffect(() => {
    register('JIRAProject');
    register('JIRAIssueType');

    return () => unregister(['JIRAIssueType', 'JIRAProject']);
  }, [register]);

  if (!jira) return { JIRAComponents: null, submitToJIRA: () => {} };

  setJIRAApiHeaders(jira);

  const submitToJIRA = () => console.log('Submitting to JIRA', getValues());

  const JIRAComponents = (
    <>
      <ProjectSelector defaultValue={jira?.projectField?.defaultValue} />
      <IssueTypeSelector defaultValue={jira?.issueTypeField?.defaultValue} />
    </>
  );

  return { JIRAComponents, submitToJIRA };
};
