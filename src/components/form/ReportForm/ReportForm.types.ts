import type { UseFormMethods } from 'react-hook-form';

export interface IReportFormProps extends UseFormMethods<IReportFormValues> {}

export interface IReportFormValues {
  uri: string;
}
