import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

interface IButtonProps {
  label?: string;
  onPress?: () => void;
  component?: ReactNode;
}

export interface IModalHeaderProps extends ViewProps {
  left?: IButtonProps;
  heading: string;
  right?: IButtonProps;
}
