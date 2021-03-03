import type { ReactNode } from 'react';
import type { TouchableOpacityProps, TextInputProps } from 'react-native';

import type { IOption } from '../RadioButton/RadioButton.types';

interface DropListTriggerProps {
  keySelected: string;
  isFocused: boolean;
  setIsFocused: (visibility: boolean) => void;
}

export interface IDropListPickerProps extends TouchableOpacityProps {
  defaultValue?: string;
  label?: string;
  error?: string;
  placehoder?: string;
  options: IOption[];
  children?: (props: DropListTriggerProps) => ReactNode;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange: (value?: string) => void;
  searchInputProps?: Partial<TextInputProps>;
}
