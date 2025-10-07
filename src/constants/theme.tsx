import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#465860ff',    // Pale Sand
  // primary: '#c5a974ff',    // Pale Sand
  secondary: '#A1D1B1',  // Charcoal Grey
  // secondary: '#575757',  // Charcoal Grey
  accent: '#E88D67',     // A warm, inviting accent for buttons

  dark: '#333333',       // Darker text for better contrast
  light: '#FFFFFF',      // Pure white for card backgrounds
  gray: '#888888',       // Softer grey for subtitles

  background: '#F9F9F7', // Use a very light, warm off-white
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  padding1: 15,


  // Font sizes
  h1: 30,
  h2: 22,
  h3: 16,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,

  // App dimensions
  width,
  height,
};

export const FONTS = {
  h1: { fontFamily: 'Poppins-Bold', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: 'Poppins-SemiBold', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: 'Poppins-Medium', fontSize: SIZES.h3, lineHeight: 22 },
  body1: { fontFamily: 'Poppins-Regular', fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: 'Poppins-Regular', fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: 'Poppins-Regular', fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: 'Poppins-Regular', fontSize: SIZES.body4, lineHeight: 22 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;