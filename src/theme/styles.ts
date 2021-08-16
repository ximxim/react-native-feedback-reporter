import { createGlobalStyle } from 'styled-components';

import type { ThemeType } from './index';

interface IProps {
  theme: ThemeType;
}

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}

export default createGlobalStyle<IProps>``;
