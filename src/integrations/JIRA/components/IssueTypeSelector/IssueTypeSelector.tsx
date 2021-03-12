import { useQuery } from 'react-query';
import React, { FunctionComponent, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import type { IIssueTypeSelectorProps } from './IssueTypeSelector.types';

import { compare } from '../../../../utils';
import { getJIRAIssueTypes } from '../../queries';
import { DropListPicker, IReportFormValues } from '../../../../components';

export const IssueTypeSelector: FunctionComponent<IIssueTypeSelectorProps> = ({
  defaultValue,
  ...dropListPickerProps
}) => {
  const { data, isLoading } = useQuery('issueTypes', getJIRAIssueTypes);
  const {
    setValue,
    watch,
    errors,
    getValues,
  } = useFormContext<IReportFormValues>();
  const projectId = getValues('JIRAProject');
  const allIssuesTypes = data?.data || [];
  const issuesWithScope = allIssuesTypes.filter(
    (issue) => issue.scope?.project?.id === projectId
  );

  const issueTypes = issuesWithScope.length ? issuesWithScope : allIssuesTypes;

  useEffect(() => {
    const val = defaultValue || '';
    const found = issueTypes.find(
      (issueType) => compare(issueType.name, val) || compare(issueType.id, val)
    );
    setValue('JIRAIssueType', found?.id);
  }, [isLoading, projectId]);

  const options = issueTypes.map((issueType) => ({
    key: issueType.id,
    value: issueType.name,
  }));

  if (isLoading) return null;

  return (
    <DropListPicker
      {...dropListPickerProps}
      options={options}
      label="Issue Type"
      error={errors.JIRAIssueType?.message}
      defaultValue={watch('JIRAIssueType')}
      onChange={(val) => setValue('JIRAIssueType', val)}
    />
  );
};
