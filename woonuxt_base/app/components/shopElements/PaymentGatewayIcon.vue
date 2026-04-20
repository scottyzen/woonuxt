<script setup lang="ts">
const iconModules = import.meta.glob('../../assets/icons/*.svg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const props = defineProps<{
  gatewayId?: string | null;
  brand?: string | null;
  iconSrc?: string | null;
  alt?: string | null;
}>();

const normalizeIconKey = (value?: string | null): string =>
  value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') || '';

const bundledBrandIcons = Object.fromEntries(
  Object.entries(iconModules).map(([path, modulePath]) => {
    const fileName =
      path
        .split('/')
        .pop()
        ?.replace(/\.svg$/i, '') || '';
    return [normalizeIconKey(fileName), modulePath];
  }),
) as Record<string, string>;

const normalizedBrand = computed<string>(() => normalizeIconKey(props.brand));
const normalizedGatewayId = computed<string>(() => props.gatewayId?.trim().toLowerCase() || '');

const resolvedAsset = computed<string | null>(() => {
  if (props.iconSrc) return props.iconSrc;
  return bundledBrandIcons[normalizedBrand.value] || null;
});

const fallbackIcon = computed<string>(() => {
  if (normalizedGatewayId.value === 'paypal' || normalizedBrand.value.includes('paypal')) return 'ion:logo-paypal';
  if (normalizedGatewayId.value === 'cod') return 'ion:cash-outline';
  return 'ion:card-outline';
});
</script>

<template>
  <span class="payment-gateway-icon" aria-hidden="true">
    <img v-if="resolvedAsset" :src="resolvedAsset" :alt="alt || brand || gatewayId || 'Payment method'" class="payment-gateway-icon-image" />
    <Icon v-else :name="fallbackIcon" size="18" class="payment-gateway-icon-fallback" />
  </span>
</template>

<style scoped>
@reference "#tailwind";

.payment-gateway-icon {
  @apply inline-flex h-6 w-8 shrink-0 items-center justify-center;
}

.payment-gateway-icon-image {
  @apply max-h-6 w-full object-contain;
}

.payment-gateway-icon-fallback {
  @apply text-current;
}
</style>
