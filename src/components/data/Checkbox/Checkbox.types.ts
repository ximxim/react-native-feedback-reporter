import type { TouchableOpacityProps } from 'react-native';

export interface ICheckboxPickerProps extends TouchableOpacityProps {
  value?: boolean;
  label?: string;
  error?: string;
  onChange: (value: boolean) => void;
}
