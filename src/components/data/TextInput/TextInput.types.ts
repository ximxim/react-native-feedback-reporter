import type { TextInputProps, ViewStyle } from 'react-native';

export interface ITextInputProps extends TextInputProps {
  label: string;
  error?: string;
  hideErrorMessage?: boolean;
  containerStyle?: ViewStyle;
  maskType?: 'phone-number';
}
