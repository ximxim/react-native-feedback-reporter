import type { ViewProps } from 'react-native';

export type IAlertVariantType = 'brandPrimary' | 'brandDanger';
export interface IAlertProps extends ViewProps {
  alert: string;
  variant?: IAlertVariantType;
  isLoading?: boolean;
}
