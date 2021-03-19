import React, { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';

import type { IProjectSelectorProps } from './ProjectSelector.types';

import { DropListPicker, IReportFormValues } from '../../../../components';

export const ProjectSelector: FunctionComponent<IProjectSelectorProps> = ({
  options,
  ...dropListPickerProps
}) => {
  const { setValue, watch, errors } = useFormContext<IReportFormValues>();

  return (
    <DropListPicker
      {...dropListPickerProps}
      label="Project"
      options={options || []}
      defaultValue={watch('JIRAProject')}
      onChange={(val) => setValue('JIRAProject', val)}
      error={errors.JIRAProject?.message}
    />
  );
};
