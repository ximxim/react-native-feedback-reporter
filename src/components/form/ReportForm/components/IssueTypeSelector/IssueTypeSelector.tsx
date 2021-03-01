import { useQuery } from 'react-query';
import React, { FunctionComponent } from 'react';

import type { IIssueTypeSelectorProps } from './IssueTypeSelector.types';

import { DropListPicker } from '../../../../data';
import { getAllIssueTypes } from '../../../../../api';

export const IssueTypeSelector: FunctionComponent<IIssueTypeSelectorProps> = ({}) => {
  const { data, isLoading } = useQuery('issueTypes', getAllIssueTypes);

  if (isLoading || !data) return null;

  return (
    <DropListPicker
      options={data.data.map((issueType) => ({
        key: issueType.id,
        value: issueType.name,
      }))}
      onChange={console.log}
    />
  );
};
