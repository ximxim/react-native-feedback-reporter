import { useFormContext } from 'react-hook-form';
import React, { FunctionComponent } from 'react';

import type { IReportFormValues } from '../../ReportForm.types';

import { TextInput } from '../../../../data';

export const Version: FunctionComponent<unknown> = () => {
  const { setValue, errors } = useFormContext<IReportFormValues>();

  return (
    <TextInput
      label="Version"
      onChangeText={(text) =>
        setValue('version', text, { shouldValidate: false })
      }
      error={errors.version?.message as string}
    />
  );
};
