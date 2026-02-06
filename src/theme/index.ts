import lightTheme from "./light";
import darkTheme from "./dark";
import { StyleSheet } from 'react-native-unistyles'
const appThemes = {
  light: lightTheme,
  other: darkTheme
}

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200
}

type AppBreakpoints = typeof breakpoints
type AppThemes = typeof appThemes


declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
      initialTheme: 'light',
  },
  breakpoints,
  themes: appThemes
})