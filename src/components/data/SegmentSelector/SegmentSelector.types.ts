import type { TouchableOpacityProps, ViewProps } from 'react-native';

export interface ISegmentOption extends TouchableOpacityProps {
  key: string;
  value: string;
}

export interface ISegmentSelectorProps extends ViewProps {
  label: string;
  error?: string;
  value?: string;
  options: ISegmentOption[];
  onChange: (key: string) => void;
}

export interface ISegmentOptionsWrapperProps {
  hasError: boolean;
}

export interface ILabelProps {
  hasError: boolean;
}

export interface IOptionProps {
  isLast: boolean;
  hasError: boolean;
}

export interface IOptionPulseProps {
  hasError: boolean;
}

export interface IOptionLabelProps {
  hasError: boolean;
  isSelected: boolean;
}
