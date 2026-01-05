export const useUserPreferences = () => {
  const colorMode = useColorMode();
  const { locale } = useI18n();

  // Get saved currency preference
  const savedCurrency = useState<string>('userCurrency', () => {
    if (process.client) {
      const saved = localStorage.getItem('userCurrency');
      return saved || 'USD';
    }
    return 'USD';
  });

  // Cycle through themes (for toggle button)
  const toggleTheme = () => {
    const themes: string[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(colorMode.preference);
    const nextTheme = themes[(currentIndex + 1) % themes.length] || 'light';
    colorMode.preference = nextTheme;
  };

  // Save currency preference
  const setCurrency = (currency: string) => {
    savedCurrency.value = currency;
    if (process.client) {
      localStorage.setItem('userCurrency', currency);
    }
  };

  // Get all preferences
  const getPreferences = () => {
    return {
      theme: colorMode.preference,
      language: locale.value,
      currency: savedCurrency.value,
    };
  };

  return {
    // Expose colorMode directly for full access to preference, value, unknown, forced
    colorMode,
    // Convenience methods
    toggleTheme,
    currency: savedCurrency,
    setCurrency,
    getPreferences,
  };
};
