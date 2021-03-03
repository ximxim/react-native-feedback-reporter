import { useFormContext } from 'react-hook-form';
import React, { FunctionComponent } from 'react';

import type { IReportFormValues } from '../../ReportForm.types';

import { TextInput } from '../../../../data';

export const IntendedOutcome: FunctionComponent<unknown> = () => {
  const { setValue, errors } = useFormContext<IReportFormValues>();

  return (
    <TextInput
      multiline
      label="Intended outcome"
      onChangeText={(text) =>
        setValue('intendedOutcome', text, { shouldValidate: false })
      }
      error={errors.intendedOutcome?.message as string}
    />
  );
};
