export const useUserPreferences = () => {
  const colorMode = useColorMode();
  const { locale, setLocale } = useI18n();

  // Get saved currency preference
  const savedCurrency = useState<string>('userCurrency', () => {
    if (process.client) {
      const saved = localStorage.getItem('userCurrency');
      return saved || 'USD';
    }
    return 'USD';
  });

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
    currency: savedCurrency,
    setCurrency,
    getPreferences,
  };
};
