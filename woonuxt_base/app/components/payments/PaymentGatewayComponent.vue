<script setup lang="ts">
import type { PaymentGateway } from '#types/gql';

const props = defineProps<{
  gateway?: PaymentGateway | string | null;
}>();

const { getGateway } = usePaymentGateways();

const gatewayId = computed(() => (typeof props.gateway === 'string' ? props.gateway : (props.gateway?.id ?? '')));
const gatewayPlugin = computed(() => getGateway(gatewayId.value));
const componentProps = computed(() => gatewayPlugin.value?.getComponentProps?.() ?? {});
const componentEvents = computed(() => gatewayPlugin.value?.getComponentEvents?.() ?? {});
</script>

<template>
  <component :is="gatewayPlugin.component" v-if="gatewayPlugin?.component" v-bind="componentProps" v-on="componentEvents" />
</template>
