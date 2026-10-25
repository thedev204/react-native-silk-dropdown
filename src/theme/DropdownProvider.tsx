import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { tokens as defaultTokens } from './tokens';

type ThemeTokens = typeof defaultTokens;

type DropdownThemeContextValue = {
  tokens: ThemeTokens;
};

const DropdownThemeContext = createContext<DropdownThemeContextValue>({
  tokens: defaultTokens,
});

export function DropdownProvider({
  children,
  tokens: tokensOverride,
}: {
  children: ReactNode;
  tokens?: Partial<ThemeTokens> & {
    colors?: Partial<ThemeTokens['colors']>;
    spacing?: Partial<ThemeTokens['spacing']>;
    radii?: Partial<ThemeTokens['radii']>;
    typography?: Partial<ThemeTokens['typography']>;
  };
}) {
  const value = useMemo<DropdownThemeContextValue>(() => {
    if (!tokensOverride) {
      return { tokens: defaultTokens };
    }

    return {
      tokens: {
        ...defaultTokens,
        ...tokensOverride,
        colors: { ...defaultTokens.colors, ...tokensOverride.colors },
        spacing: { ...defaultTokens.spacing, ...tokensOverride.spacing },
        radii: { ...defaultTokens.radii, ...tokensOverride.radii },
        typography: {
          ...defaultTokens.typography,
          ...tokensOverride.typography,
        },
        elevation: {
          ...defaultTokens.elevation,
          ...tokensOverride.elevation,
        },
      },
    };
  }, [tokensOverride]);

  return (
    <DropdownThemeContext.Provider value={value}>
      {children}
    </DropdownThemeContext.Provider>
  );
}

export function useDropdownTheme(): DropdownThemeContextValue {
  return useContext(DropdownThemeContext);
}
