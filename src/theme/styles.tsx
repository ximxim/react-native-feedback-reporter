import { createGlobalStyle } from 'styled-components';

import type { ThemeType } from './index';

interface IProps {
  theme: ThemeType;
}

export default createGlobalStyle<IProps>``;
