export const colors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F4F5',
  border: '#E4E4E7',
  text: '#18181B',
  textMuted: '#71717A',
  textInverse: '#FFFFFF',
  primary: '#2563EB',
  primaryMuted: '#DBEAFE',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  danger: '#DC2626',
  disabled: '#A1A1AA',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const typography = {
  body: 16,
  caption: 13,
  lineHeight: 22,
};

export const elevation = {
  content: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
};

export const tokens = {
  colors,
  spacing,
  radii,
  typography,
  elevation,
};

/** Dark theme preset for DropdownProvider. */
export const darkTokens = {
  colors: {
    background: '#09090B',
    surface: '#18181B',
    surfaceMuted: '#27272A',
    border: '#3F3F46',
    text: '#FAFAFA',
    textMuted: '#A1A1AA',
    textInverse: '#09090B',
    primary: '#60A5FA',
    primaryMuted: 'rgba(96, 165, 250, 0.18)',
    backdrop: 'rgba(0, 0, 0, 0.65)',
    danger: '#F87171',
    disabled: '#52525B',
  },
  elevation: {
    content: {
      shadowColor: '#000',
      shadowOpacity: 0.45,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 16,
    },
  },
} as const;
