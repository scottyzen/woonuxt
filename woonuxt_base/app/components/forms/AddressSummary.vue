<template>
  <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <button type="button" @click="$emit('edit')" class="text-sm text-primary hover:text-primary-dark font-medium underline focus:outline-none">
        {{ $t('messages.general.edit') }}
      </button>
    </div>

    <div v-if="address && hasAddress" class="text-sm text-gray-700 space-y-1">
      <div class="font-medium">{{ address.firstName }} {{ address.lastName }}</div>
      <div v-if="address.address1">{{ address.address1 }}</div>
      <div v-if="address.address2">{{ address.address2 }}</div>
      <div v-if="address.city || address.state || address.postcode">
        {{ [address.city, address.state, address.postcode].filter(Boolean).join(', ') }}
      </div>
      <div v-if="address.country">{{ address.country }}</div>
      <div v-if="address.phone" class="pt-1">{{ address.phone }}</div>
    </div>

    <div v-else class="text-sm text-gray-500 italic">
      {{ $t('messages.billing.noAddressProvided') }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  address: any;
}

const props = defineProps<Props>();

defineEmits<{
  edit: [];
}>();

const hasAddress = computed(() => {
  if (!props.address) return false;

  return !!(props.address.firstName || props.address.lastName || props.address.address1 || props.address.city || props.address.country);
});
</script>
