<script setup lang="ts">
import type { PaymentGateway, PaymentGateways } from '#types/gql';
import type { PaymentGatewayOption } from '#types/payment-gateway-plugin';

const props = defineProps<{
  modelValue: string | object;
  paymentGateways: PaymentGateways;
}>();

const paymentMethod = toRef(props, 'modelValue');
const emits = defineEmits<{
  'update:modelValue': [gateway: PaymentGateway];
}>();
const gateways = computed<PaymentGateway[]>(() => props.paymentGateways?.nodes || []);
const { getGateway } = usePaymentGateways();

const selectedGatewayId = computed<string>(() => {
  const value = paymentMethod.value as PaymentGateway | string | null | undefined;
  return (typeof value === 'string' ? value : value?.id) || gateways.value[0]?.id || '';
});

const defaultGatewayOption = (gateway: PaymentGateway): PaymentGatewayOption => {
  const plugin = getGateway(gateway.id);
  const pluginIcon = plugin?.icon;
  const icon = typeof pluginIcon === 'function' ? pluginIcon(gateway) : pluginIcon || gateway.icon || null;

  return {
    id: gateway.id,
    gateway,
    title: gateway.title || plugin?.name || 'Payment Method',
    description: gateway.description,
    icon,
    iconName: plugin?.iconName || 'ion:cash-outline',
  };
};

const paymentOptions = computed<PaymentGatewayOption[]>(() => {
  return gateways.value
    .flatMap((gateway, gatewayIndex) => {
      const options = getGateway(gateway.id)?.getPaymentOptions?.(gateway) ?? [defaultGatewayOption(gateway)];
      return options.map((option, optionIndex) => ({
        ...option,
        sortOrder: option.sortOrder ?? gatewayIndex * 100 + optionIndex,
      }));
    })
    .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0));
});

const activePaymentOption = computed<PaymentGatewayOption | null>(() => paymentOptions.value.find((option) => isOptionSelected(option)) || null);
const selectedOptionId = computed<string>(() => {
  const explicitlySelectedOption = paymentOptions.value.find((option) => option.isSelected);
  if (explicitlySelectedOption) return explicitlySelectedOption.id;

  return paymentOptions.value.find((option) => option.gateway.id === selectedGatewayId.value)?.id ?? '';
});

const isOptionSelected = (option: PaymentGatewayOption): boolean => {
  return option.id === selectedOptionId.value;
};

const updatePaymentMethod = async (option: PaymentGatewayOption) => {
  await option.onSelect?.();
  emits('update:modelValue', option.gateway);
};

watch(
  [gateways, selectedGatewayId],
  ([availableGateways, activeId]) => {
    if (!availableGateways.length) return;
    const matchedGateway = availableGateways.find((gateway) => gateway.id === activeId) || (availableGateways[0] as PaymentGateway);
    const value = paymentMethod.value as PaymentGateway | string | null | undefined;
    const currentId = typeof value === 'string' ? value : value?.id;

    if (typeof value === 'object' && value && currentId === matchedGateway.id) return;
    emits('update:modelValue', matchedGateway);
  },
  { immediate: true },
);
</script>

<template>
  <div class="w-full">
    <div class="grid gap-3" role="radiogroup" aria-label="Payment options">
      <button
        v-for="option in paymentOptions"
        :key="option.id"
        type="button"
        class="flex w-full items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3 text-left text-sm font-medium text-gray-900 transition-colors hover:border-primary hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        :class="isOptionSelected(option) ? 'border-primary' : 'border-gray-300'"
        role="radio"
        :aria-checked="isOptionSelected(option)"
        :title="option.description || option.title || 'Payment Method'"
        @click="updatePaymentMethod(option)">
        <span class="flex min-w-0 flex-1 items-center gap-3">
          <span class="grid h-6 w-6 flex-none place-items-center" aria-hidden="true">
            <NuxtImg
              v-if="option.icon"
              :src="option.icon"
              :alt="option.title || 'Payment Method'"
              width="28"
              height="24"
              class="h-5 w-6 object-contain"
              fit="contain"
              loading="lazy" />
            <icon v-else :name="option.iconName || 'ion:cash-outline'" size="22" class="text-gray-600" />
          </span>
          <span class="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 leading-tight">
            <span class="min-w-0 text-base font-semibold" v-html="option.title"></span>
            <span v-for="detail in option.details" :key="detail" class="text-base font-semibold text-gray-500">{{ detail }}</span>
          </span>
          <span v-if="option.badge" class="ml-auto hidden flex-none text-xs font-semibold text-primary sm:inline">{{ option.badge }}</span>
        </span>
        <span
          class="grid h-4 w-4 flex-none place-items-center rounded-full border transition-colors"
          :class="isOptionSelected(option) ? 'border-primary bg-primary' : 'border-gray-300 bg-white'"
          aria-hidden="true">
          <span class="h-2 w-2 rounded-full bg-white" :class="isOptionSelected(option) ? 'opacity-100' : 'opacity-0'"></span>
        </span>
      </button>
    </div>

    <div v-if="activePaymentOption?.description" class="prose block w-full mt-3">
      <p class="text-sm text-gray-500" v-html="activePaymentOption.description"></p>
    </div>
  </div>
</template>
