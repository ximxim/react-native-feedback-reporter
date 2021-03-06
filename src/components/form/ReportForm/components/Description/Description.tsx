import { useFormContext } from 'react-hook-form';
import React, { FunctionComponent } from 'react';

import type { IReportFormValues } from '../../ReportForm.types';

import { TextInput } from '../../../../data';

export const Description: FunctionComponent<unknown> = () => {
  const { setValue, errors } = useFormContext<IReportFormValues>();

  return (
    <TextInput
      multiline
      label="Description"
      onChangeText={(text) => setValue('description', text)}
      error={errors.description?.message as string}
    />
  );
};
