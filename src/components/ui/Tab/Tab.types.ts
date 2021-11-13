import type { TouchableOpacityProps } from 'react-native';

export interface ITabProps extends TouchableOpacityProps, ITabStyleProps {
  label: string;
}

export interface ITabStyleProps {
  isSelected?: boolean;
}
