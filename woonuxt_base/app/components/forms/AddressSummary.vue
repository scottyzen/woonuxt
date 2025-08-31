<template>
  <div class="p-6 bg-white border-2 border-gray-200 rounded-lg">
    <div v-if="title" class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <div v-if="hasAddress" class="flex items-center">
          <div v-if="!isAddressComplete" class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
            <Icon name="ion:warning" class="w-3 h-3" />
            {{ missingFields.length > 1 ? 'Needs attention' : 'Missing information' }}
          </div>
        </div>
      </div>
      <button
        type="button"
        @click="$emit('edit')"
        class="px-3 py-1 text-sm font-medium text-primary bg-gray-50 border border-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        {{ $t('messages.general.edit') }}
      </button>
    </div>

    <div v-else class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div v-if="hasAddress" class="flex items-center">
          <div v-if="!isAddressComplete" class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
            <Icon name="ion:warning" class="w-3 h-3" />
            {{ missingFields.length > 1 ? 'Needs attention' : 'Missing information' }}
          </div>
        </div>
      </div>
      <button
        type="button"
        @click="$emit('edit')"
        class="px-3 py-1 text-sm font-medium text-primary bg-gray-50 border border-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        {{ $t('messages.general.edit') }}
      </button>
    </div>

    <div v-if="address && hasAddress" class="grid grid-cols-1 gap-3 text-sm">
      <div v-if="address.firstName || address.lastName" class="flex flex-wrap justify-between">
        <span class="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1"
          >{{ $t('messages.billing.firstName') }} / {{ $t('messages.billing.lastName') }}</span
        >
        <span class="text-gray-900">{{ [address.firstName, address.lastName].filter(Boolean).join(' ') }}</span>
      </div>

      <div v-if="address.address1" class="flex flex-wrap justify-between">
        <span class="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1">{{ $t('messages.billing.address1') }}</span>
        <span class="text-gray-900">{{ address.address1 }}</span>
      </div>

      <div v-if="address.address2" class="flex flex-wrap justify-between">
        <span class="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1">{{ $t('messages.billing.address2') }}</span>
        <span class="text-gray-900">{{ address.address2 }}</span>
      </div>

      <div v-if="address.city || address.state || address.postcode" class="flex flex-wrap justify-between">
        <span class="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1"
          >{{ $t('messages.billing.city') }} / {{ $t('messages.billing.state') }} / {{ $t('messages.billing.zip') }}</span
        >
        <span class="text-gray-900">{{ [address.city, address.state, address.postcode].filter(Boolean).join(', ') }}</span>
      </div>

      <div v-if="address.country" class="flex flex-wrap justify-between">
        <span class="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1">{{ $t('messages.billing.country') }}</span>
        <span class="text-gray-900">{{ address.country }}</span>
      </div>

      <div v-if="address.phone" class="flex flex-wrap justify-between">
        <span class="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1">{{ $t('messages.billing.phone') }}</span>
        <span class="text-gray-900">{{ address.phone }}</span>
      </div>

      <div v-if="address.email" class="flex flex-wrap justify-between">
        <span class="font-medium text-gray-600 text-xs uppercase tracking-wide mb-1">{{ $t('messages.billing.email') }}</span>
        <span class="text-gray-900">{{ address.email }}</span>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500 italic text-center py-4">
      {{ $t('messages.billing.noAddressProvided') }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
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

const isAddressComplete = computed(() => {
  if (!props.address) return false;

  return !!(props.address.firstName && props.address.lastName && props.address.address1 && props.address.city && props.address.country);
});

const missingFields = computed(() => {
  if (!props.address) return [];

  const required = ['firstName', 'lastName', 'address1', 'city', 'country'];
  return required.filter((field) => !props.address[field]);
});
</script>
