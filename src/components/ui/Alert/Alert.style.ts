import styled from 'styled-components/native';
import { lighten } from 'polished';

import type { IAlertVariantType } from './Alert.types';

export const Wrapper = styled.View<
  { variant: IAlertVariantType } & RNFRThemeType
>`
  margin: 8px;
  padding: 6px 16px;
  border-radius: 4px;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.brandDanger};
  background-color: ${({ theme, variant }) =>
    lighten(theme.colors.lightenLevels.lvl2, theme.colors[variant])};
`;

export const ActivityIndicator = styled.ActivityIndicator`
  padding: 10px 8px;
`;
