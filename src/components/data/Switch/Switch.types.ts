import type { SwitchProps } from 'react-native';

export interface ISwitchProps extends Partial<SwitchProps> {
  defaultValue?: boolean;
  label?: string;
  error?: string;
  onChange: (value: boolean) => void;
}
