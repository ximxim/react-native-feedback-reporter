const h1 = 26;
const h2 = h1 * 0.94;
const h3 = h1 * 0.88;
const h4 = h1 * 0.82;
const h5 = h1 * 0.75;
const h6 = h1 * 0.69;
const subtitle1 = h1 * 0.63;
const subtitle2 = h1 * 0.5;
const body1 = h1 * 0.63;
const body2 = h1 * 0.57;
const button = h1 * 0.57;
const caption = h1 * 0.5;
const overline = h1 * 0.5;

const MARGIN_GUTTER = 0.35;

const textVariants = {
  h1: {
    fontSize: h1,
    fontWeight: 600,
    lineHeight: h1 * 1.167,
    letterSpacing: 3,
    marginBottom: h1 * MARGIN_GUTTER,
  },
  h2: {
    fontSize: h2,
    fontWeight: 600,
    lineHeight: h2 * 1.2,
    letterSpacing: 2,
    marginBottom: h2 * MARGIN_GUTTER,
  },
  h3: {
    fontSize: h3,
    fontWeight: 600,
    lineHeight: h3 * 1.167,
    marginBottom: h3 * MARGIN_GUTTER,
  },
  h4: {
    fontSize: h4,
    fontWeight: 500,
    lineHeight: h4 * 1.235,
    letterSpacing: 0.5,
    marginBottom: h4 * MARGIN_GUTTER,
  },
  h5: {
    fontSize: h5,
    fontWeight: 400,
    lineHeight: h5 * 1.334,
    letterSpacing: 0.5,
    marginBottom: h5 * MARGIN_GUTTER,
  },
  h6: {
    fontSize: h6,
    fontWeight: 500,
    lineHeight: h6 * 1.6,
    marginBottom: h6 * MARGIN_GUTTER,
  },
  subtitle1: {
    fontSize: subtitle1,
    fontWeight: 300,
    lineHeight: subtitle1 * 1.3,
    marginBottom: subtitle1 * MARGIN_GUTTER,
  },
  subtitle2: {
    fontSize: subtitle2,
    fontWeight: 500,
    lineHeight: subtitle2 * 1.57,
    marginBottom: subtitle2 * MARGIN_GUTTER,
  },
  body1: {
    fontSize: body1,
    fontWeight: 400,
    lineHeight: body1 * 1.3,
    marginBottom: body1 * MARGIN_GUTTER,
  },
  body2: {
    fontSize: body2,
    fontWeight: 300,
    lineHeight: body2 * 1.43,
    marginBottom: body2 * MARGIN_GUTTER,
  },
  button: {
    fontSize: button,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    lineHeight: button * 1.75,
    marginBottom: button * MARGIN_GUTTER,
  },
  caption: {
    fontSize: caption,
    fontWeight: 400,
    lineHeight: caption * 1.66,
    marginBottom: caption * MARGIN_GUTTER,
  },
  overline: {
    fontSize: overline,
    fontWeight: 300,
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: overline * 2.66,
    marginBottom: overline * MARGIN_GUTTER,
  },
  link: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    backgroundColor: 'transparent',
  },
};

const base = {
  textVariants,
  colors: {
    blurType: 'light',
    brandPrimary: '#FEF2C2',
    brandSecondary: '#373700',
    brandMuted: '#373700',
    brandSuccess: '#2A7F4F',
    brandDanger: '#B21F2D',
    incomingMessagebg: '#FFDBC1',
    incomingMessageColor: '#000000',
    outgoingMessagebg: '#E0EEDE',
    outgoingMessageColor: '#000000',
    maleColor: '#328EB9',
    femaleColor: '#F490A7',
    otherColor: '#6b747d',
    barStyle: 'dark-content',
    lightenLevels: {
      lvl1: 0,
      lvl2: 0.05,
      lvl3: 0.08,
    },
  },
};

export type ThemeType = typeof base;

const navyBlue: ThemeType = {
  textVariants,
  colors: {
    blurType: 'dark',
    brandPrimary: '#001f3f',
    brandSecondary: '#ffffff',
    brandMuted: '#ffffff',
    brandSuccess: '#2A7F4F',
    brandDanger: '#f3b6bd',
    incomingMessagebg: '#FFDBC1',
    incomingMessageColor: '#000000',
    outgoingMessagebg: '#E0EEDE',
    outgoingMessageColor: '#000000',
    maleColor: '#328EB9',
    femaleColor: '#F490A7',
    otherColor: '#6b747d',
    barStyle: 'light-content',
    lightenLevels: {
      lvl1: 0,
      lvl2: 0.1,
      lvl3: 0.2,
    },
  },
};

const dark: ThemeType = {
  textVariants,
  colors: {
    blurType: 'dark',
    brandPrimary: '#283349',
    brandSecondary: '#ffffff',
    brandMuted: '#b4b4b4',
    brandSuccess: '#2A7F4F',
    brandDanger: '#B21F2D',
    incomingMessagebg: '#FFDBC1',
    incomingMessageColor: '#000000',
    outgoingMessagebg: '#E0EEDE',
    outgoingMessageColor: '#000000',
    maleColor: '#328EB9',
    femaleColor: '#F490A7',
    otherColor: '#ccc',
    barStyle: 'light-content',
    lightenLevels: {
      lvl1: 0,
      lvl2: 0.1,
      lvl3: 0.15,
    },
  },
};

const champagne: ThemeType = {
  textVariants,
  colors: {
    blurType: 'light',
    brandPrimary: '#F4DEC2',
    brandSecondary: '#4e2c00',
    brandMuted: '#4e2c00',
    brandSuccess: '#2A7F4F',
    brandDanger: '#B21F2D',
    incomingMessagebg: '#FFDBC1',
    incomingMessageColor: '#000000',
    outgoingMessagebg: '#E0EEDE',
    outgoingMessageColor: '#000000',
    maleColor: '#328EB9',
    femaleColor: '#F490A7',
    otherColor: '#6b747d',
    barStyle: 'dark-content',
    lightenLevels: {
      lvl1: 0,
      lvl2: 0.05,
      lvl3: 0.07,
    },
  },
};

const teaGreen: ThemeType = {
  textVariants,
  colors: {
    blurType: 'light',
    brandPrimary: '#D4EAD3',
    brandSecondary: '#024100',
    brandMuted: '#024100',
    brandSuccess: '#2A7F4F',
    brandDanger: '#B21F2D',
    incomingMessagebg: '#FFDBC1',
    incomingMessageColor: '#000000',
    outgoingMessagebg: '#E0EEDE',
    outgoingMessageColor: '#000000',
    maleColor: '#328EB9',
    femaleColor: '#F490A7',
    otherColor: '#6b747d',
    barStyle: 'dark-content',
    lightenLevels: {
      lvl1: 0,
      lvl2: 0.05,
      lvl3: 0.07,
    },
  },
};

const crystal: ThemeType = {
  textVariants,
  colors: {
    blurType: 'light',
    brandPrimary: '#ABCCCF',
    brandSecondary: '#002428',
    brandMuted: '#002428',
    brandSuccess: '#2A7F4F',
    brandDanger: '#63111a',
    incomingMessagebg: '#FFDBC1',
    incomingMessageColor: '#000000',
    outgoingMessagebg: '#E0EEDE',
    outgoingMessageColor: '#000000',
    maleColor: '#328EB9',
    femaleColor: '#F490A7',
    otherColor: '#6b747d',
    barStyle: 'dark-content',
    lightenLevels: {
      lvl1: 0,
      lvl2: 0.05,
      lvl3: 0.07,
    },
  },
};

const pastelGray: ThemeType = {
  textVariants,
  colors: {
    blurType: 'light',
    brandPrimary: '#CDD1C0',
    brandSecondary: '#1e2800',
    brandMuted: '#1e2800',
    brandSuccess: '#2A7F4F',
    brandDanger: '#63111a',
    incomingMessagebg: '#FFDBC1',
    incomingMessageColor: '#000000',
    outgoingMessagebg: '#E0EEDE',
    outgoingMessageColor: '#000000',
    maleColor: '#328EB9',
    femaleColor: '#F490A7',
    otherColor: '#6b747d',
    barStyle: 'dark-content',
    lightenLevels: {
      lvl1: 0,
      lvl2: 0.05,
      lvl3: 0.07,
    },
  },
};

const grape: ThemeType = {
  textVariants,
  colors: {
    blurType: 'light',
    brandPrimary: '#DFD0F5',
    brandSecondary: '#1c0046',
    brandMuted: '#1c0046',
    brandSuccess: '#2A7F4F',
    brandDanger: '#63111a',
    incomingMessagebg: '#FFDBC1',
    incomingMessageColor: '#000000',
    outgoingMessagebg: '#E0EEDE',
    outgoingMessageColor: '#000000',
    maleColor: '#328EB9',
    femaleColor: '#F490A7',
    otherColor: '#6b747d',
    barStyle: 'dark-content',
    lightenLevels: {
      lvl1: 0,
      lvl2: 0.05,
      lvl3: 0.07,
    },
  },
};

export const theme = {
  base,
  dark,
  grape,
  crystal,
  navyBlue,
  teaGreen,
  champagne,
  pastelGray,
};

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
