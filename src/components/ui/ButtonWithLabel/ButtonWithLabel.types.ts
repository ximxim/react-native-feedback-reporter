import type { ReactNode } from 'react';
import type { TouchableOpacityProps } from 'react-native';

// Getting these from https://oblador.github.io/react-native-vector-icons/
type MaterialIconNames = 'incognito' | 'google' | 'facebook';

export interface IButtonWithLabelProps extends TouchableOpacityProps {
  children: ReactNode;
  icon?: MaterialIconNames;
  isLoading?: boolean;
}
