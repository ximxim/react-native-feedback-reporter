import { useFormContext } from 'react-hook-form';
import React, { FunctionComponent } from 'react';

import type { IReportFormValues } from '../../ReportForm.types';

import { TextInput } from '../../../../data';

export const ActualOutcome: FunctionComponent<unknown> = () => {
  const { setValue, errors } = useFormContext<IReportFormValues>();

  return (
    <TextInput
      multiline
      label="Actual outcome"
      onChangeText={(text) =>
        setValue('actualOutcome', text, { shouldValidate: false })
      }
      error={errors.actualOutcome?.message as string}
    />
  );
};
