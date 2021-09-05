import type { TouchableOpacityProps } from 'react-native';

export interface ICheckboxPickerProps extends TouchableOpacityProps {
  defaultValue?: boolean;
  label?: string;
  error?: string;
  onChange: (value: boolean) => void;
}
