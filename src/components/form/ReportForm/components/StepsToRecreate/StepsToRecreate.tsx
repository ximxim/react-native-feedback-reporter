import { useFormContext } from 'react-hook-form';
import React, { FunctionComponent } from 'react';

import type { IReportFormValues } from '../../ReportForm.types';

import { TextInput } from '../../../../data';

export const StepsToRecreate: FunctionComponent<unknown> = () => {
  const { watch, errors } = useFormContext<IReportFormValues>();

  return (
    <TextInput
      multiline
      label="Steps to recreate"
      onChangeText={(text) => watch('stepsToRecreate', text)}
      error={errors.stepsToRecreate?.message as string}
    />
  );
};
