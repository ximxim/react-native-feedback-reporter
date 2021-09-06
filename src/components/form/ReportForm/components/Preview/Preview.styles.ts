import styled from 'styled-components/native';
import RNJSONTree from 'react-native-json-tree';

import { metrics } from '../../../../../utils';

export const ScreenShotWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${metrics.margin}px;
`;

export const JSONTree = styled(RNJSONTree).attrs(
  ({ theme }: RNFRThemeType) => ({
    theme: {
      label: {
        color: theme.colors.brandSecondary,
      },
      valueLabel: {
        color: theme.colors.brandSecondary,
      },
      value: {
        color: theme.colors.brandSecondary,
      },
      tree: {
        backgroundColor: theme.colors.brandPrimary,
      },
      arrowSign: {
        color: theme.colors.brandSecondary,
      },
      nestedNodeItemType: {
        color: theme.colors.brandMuted,
      },
      valueText: ({ style }: any) => ({
        style: {
          ...style,
          color: theme.colors.brandDanger,
        },
      }),
      nestedNodeItemString: ({ style }: any) => ({
        style: {
          ...style,
          color: theme.colors.brandMuted,
        },
      }),
    },
  })
)``;
