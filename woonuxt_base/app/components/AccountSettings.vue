<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();

// Settings data - preferences are real, others are mock
const settings = ref({
  preferences: {
    language: locale.value,
  },
  notifications: {
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    priceDrops: true,
    backInStock: true,
    smsNotifications: false,
    emailDigest: 'instant',
  },
});

// Map i18n locales to simplified codes for the UI
const languages = computed(() => {
  return locales.value.map((loc: any) => ({
    value: loc.code,
    label: loc.name,
  }));
});

const digestFrequencies = [
  { value: 'instant', label: 'Instant' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly Summary' },
  { value: 'never', label: 'Never' },
];

const saving = ref(false);
const successMessage = ref(false);

// Watch for language changes and apply immediately
watch(
  () => settings.value.preferences.language,
  async (newLanguage) => {
    if (newLanguage !== locale.value) {
      await setLocale(newLanguage);
    }
  },
);

const saveSettings = async () => {
  saving.value = true;

  // Apply language
  if (settings.value.preferences.language !== locale.value) {
    await setLocale(settings.value.preferences.language);
  }

  // Simulate saving other settings (notifications, privacy)
  // In production, these would be saved to backend via GraphQL
  await new Promise((resolve) => setTimeout(resolve, 800));

  saving.value = false;
  successMessage.value = true;

  // Hide success message after 3 seconds
  setTimeout(() => {
    successMessage.value = false;
  }, 3000);
};

const deleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    // In production, this would call a GraphQL mutation or REST API endpoint
    alert('Account deletion would be processed here. This requires custom backend implementation.');
  }
};
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage your preferences, notifications, and privacy settings</p>
    </div>

    <form @submit.prevent="saveSettings" class="space-y-6 wn-form">
      <!-- Preferences Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700">
        <div class="p-6 md:px-8 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h3>
        </div>

        <div class="p-6 md:p-8 space-y-6">
          <!-- Language -->
          <div class="space-y-2">
            <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
            <select id="language" v-model="settings.preferences.language">
              <option v-for="lang in languages" :key="lang.value" :value="lang.value">{{ lang.label }}</option>
            </select>
          </div>
        </div>
      </div>
    </form>

    <!-- Danger Zone -->
    <div class="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-red-200 dark:border-red-800 overflow-hidden">
      <div class="p-6 md:px-8 pb-4 border-b border-red-100 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <h3 class="text-lg font-semibold text-red-900 dark:text-red-400">Danger Zone</h3>
      </div>
      <div class="p-6 md:p-8">
        <div class="flex items-center justify-between gap-6">
          <div class="flex items-start gap-3 flex-1">
            <div class="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
              <Icon name="ion:warning-outline" size="20" class="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Delete Account</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Once you delete your account, there is no going back. This will permanently delete your account, order history, and all associated data.
              </p>
            </div>
          </div>
          <Button variant="danger" type="button" icon="ion:trash-outline" @click="deleteAccount"> Delete </Button>
        </div>
      </div>
    </div>
  </div>
</template>
