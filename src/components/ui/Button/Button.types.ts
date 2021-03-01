import type { ReactNode } from 'react';
import type { TouchableOpacityProps } from 'react-native';

// Getting these from https://oblador.github.io/react-native-vector-icons/
export type MaterialIconNames = 'person' | 'color-lens' | 'translate';

export interface IButtonProps extends TouchableOpacityProps {
  name?: MaterialIconNames;
  children?: ReactNode;
}
