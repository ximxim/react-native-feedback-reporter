import React, { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';

import type { IIssueTypeSelectorProps } from './IssueTypeSelector.types';

import { DropListPicker, IReportFormValues } from '../../../../components';

export const IssueTypeSelector: FunctionComponent<IIssueTypeSelectorProps> = ({
  options,
  ...dropListPickerProps
}) => {
  const { setValue, watch, errors } = useFormContext<IReportFormValues>();

  return (
    <DropListPicker
      {...dropListPickerProps}
      label="Issue Type"
      options={options || []}
      error={errors.JIRAIssueType?.message}
      defaultValue={watch('JIRAIssueType')}
      onChange={(val) => setValue('JIRAIssueType', val)}
    />
  );
};
