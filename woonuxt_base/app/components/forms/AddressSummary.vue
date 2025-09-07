<template>
  <div class="bg-white border rounded-md outline-none border-gray-200 shadow-sm w-full p-4">
    <!-- Header with name and edit button -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div>
          <h3 v-if="address?.firstName || address?.lastName" class="text-lg font-semibold text-gray-900">
            {{ [address.firstName, address.lastName].filter(Boolean).join(' ') }}
          </h3>
          <h3 v-else class="text-lg font-medium text-gray-500">No address provided</h3>
          <div v-if="shouldShowValidationWarning" class="flex items-center gap-1 mt-1">
            <Icon name="ion:warning" class="w-3 h-3 text-orange-500" />
            <span class="text-xs text-orange-600 font-medium">
              {{ missingFields.length > 1 ? 'Needs attention' : 'Missing information' }}
            </span>
          </div>
        </div>
      </div>

      <button type="button" @click="$emit('edit')" class="flex items-center gap-2 text-sm font-medium text-primary">
        <Icon name="ion:pencil" class="w-4 h-4" />
        Edit
      </button>
    </div>

    <!-- Address details -->
    <div v-if="address && hasAddress" class="space-y-2">
      <div
        v-if="address.address1 || address.address2 || address.city || address.state || address.postcode || address.country"
        class="flex items-center gap-2 text-gray-700">
        <Icon name="ion:home" class="w-4 h-4" />
        <span class="text-sm">
          {{
            [address.address1, address.address2, [address.city, address.state, address.postcode].filter(Boolean).join(', '), address.country]
              .filter(Boolean)
              .join(' · ')
          }}
        </span>
      </div>

      <div v-if="address.phone" class="flex items-center gap-2 text-gray-700">
        <Icon name="ion:call" class="w-4 h-4" />
        <span class="text-sm">{{ address.phone }}</span>
      </div>

      <div v-if="address.email" class="flex items-center gap-2 text-gray-700">
        <Icon name="ion:mail" class="w-4 h-4" />
        <span class="text-sm">{{ address.email }}</span>
      </div>
    </div>

    <div v-else class="flex items-center gap-2 text-gray-500 italic">
      <Icon name="ion:add-circle-outline" class="w-4 h-4" />
      <span class="text-sm">Click edit to add address details</span>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  title?: string;
  address: any;
  showValidationWarnings?: boolean; // New prop to control when to show validation warnings
}

const props = withDefaults(defineProps<Props>(), {
  showValidationWarnings: true, // Default to true to maintain existing behavior
});

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

// Only show validation warnings if explicitly enabled and there are issues
const shouldShowValidationWarning = computed(() => {
  return props.showValidationWarnings && hasAddress.value && !isAddressComplete.value;
});
</script>
