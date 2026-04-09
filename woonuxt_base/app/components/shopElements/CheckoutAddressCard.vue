<script setup lang="ts">
import type { Address } from '#types/gql';

const props = withDefaults(
  defineProps<{
    address: Address;
    actionAriaLabel?: string;
  }>(),
  {
    actionAriaLabel: 'Edit address',
  },
);

const emit = defineEmits(['edit']);
const { countriesToShow } = useCountry();

const fullName = computed(() => {
  const name = [props.address?.firstName, props.address?.lastName].filter(Boolean).join(' ').trim();
  return name || 'Saved address';
});

const countryName = computed(() => {
  if (!props.address?.country) return '';
  return countriesToShow.value.find((country) => country.code === props.address.country)?.name || props.address.country;
});

const addressLines = computed(() => {
  const line1 = [props.address?.address1, props.address?.address2].filter(Boolean).join(', ');
  const line2Start = [props.address?.city, props.address?.state].filter(Boolean).join(', ');
  const line2 = [line2Start, props.address?.postcode].filter(Boolean).join(line2Start && props.address?.postcode ? ' ' : '');

  return [line1, line2, countryName.value, props.address?.phone].filter(Boolean);
});
</script>

<template>
  <div
    class="rounded-[1.75rem] border-2 border-gray-900/90 bg-white px-5 py-5 shadow-[0_16px_32px_-24px_rgba(15,23,42,0.45)]  ">
    <div class="flex items-start gap-4">
      <div class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white shadow-xs  ">
        <span class="h-4.5 w-4.5 rounded-full bg-gray-900 " />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="text-xl font-semibold tracking-tight text-gray-900  sm:text-[2rem] sm:leading-none">{{ fullName }}</p>
            <div class="mt-3 space-y-1.5 text-base leading-7 text-gray-700  sm:text-lg">
              <p v-for="line in addressLines" :key="line" class="truncate sm:whitespace-normal">{{ line }}</p>
            </div>
          </div>

          <button
            type="button"
            :aria-label="actionAriaLabel"
            class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900   "
            @click="emit('edit')">
            <Icon name="ion:pencil-outline" size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>