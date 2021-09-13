import styled from 'styled-components/native';
import RNJSONTree from 'react-native-json-tree';

import { metrics } from '../../../../../utils';

export const ScreenShotWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${metrics.margin}px;
`;

export const JSONTree = styled<any>(RNJSONTree).attrs(
  ({ theme }: RNFRThemeType) => ({
    theme: {
      label: {
        fontFamily: 'System',
        color: theme.colors.brandSecondary,
      },
      valueLabel: {
        fontFamily: 'System',
        color: theme.colors.brandSecondary,
      },
      value: {
        fontFamily: 'System',
        color: theme.colors.brandSecondary,
      },
      tree: {
        fontFamily: 'System',
        backgroundColor: theme.colors.brandPrimary,
      },
      arrowSign: {
        fontFamily: 'System',
        color: theme.colors.brandSecondary,
      },
      nestedNodeItemType: {
        fontFamily: 'System',
        color: theme.colors.brandMuted,
      },
      valueText: ({ style }: any) => ({
        style: {
          ...style,
          fontFamily: 'System',
          color: theme.colors.brandDanger,
        },
      }),
      nestedNodeItemString: ({ style }: any) => ({
        style: {
          ...style,
          fontFamily: 'System',
          color: theme.colors.brandMuted,
        },
      }),
    },
  })
)``;
