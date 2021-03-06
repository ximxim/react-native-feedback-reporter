import { useEffect, useContext } from 'react';
import { useQuery } from 'react-query';
import { useFormContext } from 'react-hook-form';

import { compare } from '../../../utils';
import { getJIRAIssueTypes } from '../queries';
import { IReportFormValues, IOption, GlobalProps } from '../../../components';

export const useJIRAIssueType = () => {
  const { jira, authState } = useContext(GlobalProps);
  const { data, isLoading, error } = useQuery('issueTypes', getJIRAIssueTypes, {
    enabled: !!(
      (authState.jira?.token && authState.jira?.username) ||
      (jira?.username && jira?.token)
    ),
  });
  const {
    setValue,
    register,
    unregister,
    getValues,
  } = useFormContext<IReportFormValues>();
  const projectId = getValues('JIRAProject');
  const allIssuesTypes = data?.data || [];
  const issuesWithScope = allIssuesTypes.filter(
    (issue) => issue.scope?.project?.id === projectId
  );

  const issueTypes = issuesWithScope.length ? issuesWithScope : allIssuesTypes;

  useEffect(() => {
    if (!jira) return;

    register('JIRAIssueType');

    return () => {
      unregister(['JIRAIssueType']);
    };
  }, [register]);

  useEffect(() => {
    const val = jira?.issueTypeField?.defaultValue || '';
    const found = issueTypes.find(
      (issueType) => compare(issueType.name, val) || compare(issueType.id, val)
    );
    setValue('JIRAIssueType', found?.id);
  }, [isLoading, projectId]);

  const options: IOption[] = issueTypes.map((issueType) => ({
    key: issueType.id,
    value: issueType.name,
  }));

  if (isLoading) return { options: [] };

  return { options, error };
};
