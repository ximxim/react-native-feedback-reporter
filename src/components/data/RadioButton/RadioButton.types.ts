import type { TouchableOpacityProps, ViewProps } from 'react-native';

export interface IOption extends TouchableOpacityProps {
  key: string;
  value: string;
}

export interface IRadioButtonPickerProps extends ViewProps {
  value: string;
  label?: string;
  error?: string;
  options: IOption[];
  onChange: (key: string) => void;
}

export interface IOptionsWrapperProps {
  isFirst: boolean;
  isLast: boolean;
}
