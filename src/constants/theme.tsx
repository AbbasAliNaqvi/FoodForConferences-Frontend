import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#4C7380',    
  secondary: '#FFC107',  
  dark: '#212121',       // For primary text
  light: '#FFFFFF',      // For backgrounds and light text
  gray: '#9E9E9E',       // For secondary text, borders
  success: '#4CAF50',
  error: '#F44336',
  background: '#F5F5F5', // Off-white background for less eye strain
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

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