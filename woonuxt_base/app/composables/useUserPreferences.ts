export const useUserPreferences = () => {
  const { locale } = useI18n();

  // Get saved currency preference
  const savedCurrency = useState<string>('userCurrency', () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('userCurrency');
      return saved || 'USD';
    }
    return 'USD';
  });

  // Save currency preference
  const setCurrency = (currency: string) => {
    savedCurrency.value = currency;
    if (import.meta.client) {
      localStorage.setItem('userCurrency', currency);
    }
  };

  // Get all preferences
  const getPreferences = () => {
    return {
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
