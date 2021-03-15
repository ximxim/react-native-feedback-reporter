import type { ViewProps } from 'react-native';

export interface IAlertProps extends ViewProps {
  alert: string;
  isLoading?: boolean;
}
