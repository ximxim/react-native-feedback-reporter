import type { TextInputProps, ViewStyle } from 'react-native';

export interface ITextInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  maskType?: 'phone-number';
}
