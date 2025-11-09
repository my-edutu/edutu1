export type SemanticColorToken =
  | 'brand'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'surface'
  | 'text'
  | 'border';

export interface PaletteScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SemanticPalette {
  brand: PaletteScale;
  accent: PaletteScale;
  neutral: PaletteScale & { 0: string };
  success: PaletteScale;
  warning: PaletteScale;
  danger: PaletteScale;
  info: PaletteScale;
  surface: {
    body: string;
    layer: string;
    elevated: string;
    overlay: string;
    brandTint: string;
    borderSubtle: string;
    borderBold: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverted: string;
    link: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
    focus: string;
  };
}

export interface TypographyScale {
  fontFamilies: {
    display: string[];
    body: string[];
    mono: string[];
  };
  sizes: {
    xs: [fontSize: string, lineHeight: string];
    sm: [fontSize: string, lineHeight: string];
    base: [fontSize: string, lineHeight: string];
    lg: [fontSize: string, lineHeight: string];
    xl: [fontSize: string, lineHeight: string];
    '2xl': [fontSize: string, lineHeight: string];
    '3xl': [fontSize: string, lineHeight: string];
    '4xl': [fontSize: string, lineHeight: string];
  };
  tracking: {
    tight: string;
    normal: string;
    wide: string;
  };
  weight: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface SpatialScale {
  radius: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    pill: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  shadows: {
    soft: string;
    elevated: string;
    focus: string;
    ring: string;
  };
}

export interface DesignTokens {
  semantic: SemanticPalette;
  typography: TypographyScale;
  spatial: SpatialScale;
}

const baseTypography: TypographyScale = {
  fontFamilies: {
    display: ['"Outfit"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
    body: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
  },
  sizes: {
    xs: ['0.75rem', '1rem'],
    sm: ['0.875rem', '1.25rem'],
    base: ['1rem', '1.5rem'],
    lg: ['1.125rem', '1.75rem'],
    xl: ['1.25rem', '1.8rem'],
    '2xl': ['1.5rem', '2rem'],
    '3xl': ['1.875rem', '2.3rem'],
    '4xl': ['2.25rem', '2.6rem'],
  },
  tracking: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

const baseSpatial: SpatialScale = {
  radius: {
    xs: '0.375rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1.25rem',
    xl: '1.75rem',
    pill: '999px',
  },
  spacing: {
    xs: '0.375rem',      // 6px - tighter inline spacing
    sm: '0.75rem',       // 12px - component padding
    md: '1.25rem',       // 20px - card padding
    lg: '2rem',          // 32px - section spacing
    xl: '3rem',          // 48px - screen margins
    '2xl': '4rem',       // 64px - hero sections
  },
  shadows: {
    soft: '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(20, 184, 166, 0.08), 0 2px 12px rgba(6, 182, 212, 0.06)',
    elevated: '0 1px 3px rgba(0,0,0,0.05), 0 20px 60px rgba(20, 184, 166, 0.15), 0 4px 16px rgba(6, 182, 212, 0.1)',
    focus: '0 0 0 3px rgba(20, 184, 166, 0.35)',
    ring: '0 0 0 4px rgba(20, 184, 166, 0.15)',
  },
};

export const lightTokens: DesignTokens = {
  semantic: {
    brand: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6',
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
      950: '#042F2E',
    },
    accent: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
      950: '#431407',
    },
    neutral: {
      0: '#FCFCFD',
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5F5',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      950: '#020617',
    },
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
      950: '#022C22',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      950: '#451A03',
    },
    danger: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
      950: '#450A0A',
    },
    info: {
      50: '#ECFEFF',
      100: '#CFFAFE',
      200: '#A5F3FC',
      300: '#67E8F9',
      400: '#22D3EE',
      500: '#06B6D4',
      600: '#0891B2',
      700: '#0E7490',
      800: '#155E75',
      900: '#164E63',
      950: '#082F49',
    },
    surface: {
      body: '#FAFBFC',
      layer: '#FFFFFF',
      elevated: '#FFFFFF',
      overlay: 'rgba(15, 23, 42, 0.48)',
      brandTint: '#F0FDFA',
      borderSubtle: '#E2E8F0',
      borderBold: '#CBD5F5',
    },
    text: {
      primary: '#1A202C',
      secondary: '#334155',
      muted: '#64748B',
      inverted: '#FFFFFF',
      link: '#0D9488',
    },
    border: {
      subtle: '#E2E8F0',
      default: '#CBD5F5',
      strong: '#94A3B8',
      focus: 'rgba(20, 184, 166, 0.4)',
    },
  },
  typography: baseTypography,
  spatial: baseSpatial,
};

export const darkTokens: DesignTokens = {
  semantic: {
    brand: lightTokens.semantic.brand,
    accent: lightTokens.semantic.accent,
    neutral: {
      0: '#080B18',
      50: '#0C0F1A',
      100: '#111622',
      200: '#171E2C',
      300: '#1D2638',
      400: '#242F46',
      500: '#2F3D59',
      600: '#425272',
      700: '#647A9C',
      800: '#94ABCD',
      900: '#CFDAEE',
      950: '#F1F5F9',
    },
    success: lightTokens.semantic.success,
    warning: lightTokens.semantic.warning,
    danger: lightTokens.semantic.danger,
    info: lightTokens.semantic.info,
    surface: {
      body: '#000000',
      layer: 'rgba(255, 255, 255, 0.05)',
      elevated: 'rgba(20, 184, 166, 0.08)',
      overlay: 'rgba(0, 0, 0, 0.75)',
      brandTint: 'rgba(20, 184, 166, 0.1)',
      borderSubtle: 'rgba(255, 255, 255, 0.1)',
      borderBold: 'rgba(255, 255, 255, 0.15)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.5)',
      inverted: '#000000',
      link: '#2DD4BF',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.1)',
      default: 'rgba(255, 255, 255, 0.15)',
      strong: 'rgba(255, 255, 255, 0.25)',
      focus: 'rgba(20, 184, 166, 0.4)',
    },
  },
  typography: baseTypography,
  spatial: {
    ...baseSpatial,
    shadows: {
      soft: '0 12px 24px -16px rgba(4, 7, 16, 0.5), 0 0 20px rgba(20, 184, 166, 0.15)',
      elevated: '0 20px 60px -18px rgba(6, 12, 24, 0.6), 0 0 40px rgba(20, 184, 166, 0.2)',
      focus: '0 0 0 3px rgba(20, 184, 166, 0.45)',
      ring: '0 0 0 4px rgba(20, 184, 166, 0.25)',
    },
  },
};

export const designTokens = {
  light: lightTokens,
  dark: darkTokens,
};

export type ThemeName = keyof typeof designTokens;
