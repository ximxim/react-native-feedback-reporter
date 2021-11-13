import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

export interface IModalButtonProps {
  label?: string;
  onPress?: () => void;
  component?: ReactNode;
}

export interface IModalHeaderProps extends ViewProps {
  left?: IModalButtonProps;
  heading: string;
  right?: IModalButtonProps;
}
