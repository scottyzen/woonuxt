<script setup>
const { locales, locale, setLocale, setLocaleCookie } = useI18n();

const switchLanguage = async (newLocale) => {
  await setLocale(newLocale);
};

watch(locale, (newLocale) => {
  if (newLocale) {
    setLocaleCookie(newLocale);
  }
});
</script>

<template>
  <select id="language-switcher" :value="locale" aria-label="Language switcher" class="select text-sm font-medium dark:text-gray-300" @change="switchLanguage($event.target.value)">
    <option v-for="locale in locales" :key="locale" :value="locale.code" v-html="locale.name" />
  </select>
</template>
