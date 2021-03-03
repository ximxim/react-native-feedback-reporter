import { useQuery } from 'react-query';
import React, { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';

import type { IIssueTypeSelectorProps } from './IssueTypeSelector.types';
import type { IReportFormValues } from '../../ReportForm.types';

import { DropListPicker } from '../../../../data';
import { getAllIssueTypes } from '../../../../../api';
import { compare } from '../../../../../utils';

export const IssueTypeSelector: FunctionComponent<IIssueTypeSelectorProps> = ({}) => {
  const { data, isLoading } = useQuery('issueTypes', getAllIssueTypes);
  const { setValue, getValues } = useFormContext<IReportFormValues>();

  if (isLoading || !data) return null;

  return (
    <DropListPicker
      options={data.data.map((issueType) => ({
        key: issueType.id,
        value: issueType.name,
      }))}
      label="Issue Type"
      defaultValue={
        data.data.find((issueType) => {
          const val = getValues('issueType') || '';
          return compare(issueType.name, val) || compare(issueType.id, val);
        })?.id
      }
      onChange={(val) => setValue('issueType', val)}
    />
  );
};
