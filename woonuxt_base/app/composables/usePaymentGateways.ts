import type { PaymentGatewayPlugin, PaymentGatewayProcessResult } from '#types/payment-gateway-plugin';

import type { PaymentGateway } from '#types/gql';
import type { ShallowRef } from 'vue';

type GatewayRegistryNuxtApp = ReturnType<typeof useNuxtApp> & {
  _paymentGatewayPlugins?: ShallowRef<Map<string, PaymentGatewayPlugin>>;
};

export function usePaymentGateways() {
  const nuxtApp = useNuxtApp() as GatewayRegistryNuxtApp;
  nuxtApp._paymentGatewayPlugins ??= shallowRef(new Map<string, PaymentGatewayPlugin>());

  const gatewayPlugins = nuxtApp._paymentGatewayPlugins;
  const activeGatewayId = useState<string | null>('activePaymentGatewayId', () => null);

  const registerGateway = (plugin: PaymentGatewayPlugin): void => {
    if (!plugin.id) {
      console.error('[usePaymentGateways] Cannot register a gateway without an id.');
      return;
    }

    const nextPlugins = new Map(gatewayPlugins.value);
    nextPlugins.set(plugin.id, plugin);
    gatewayPlugins.value = nextPlugins;
  };

  const getGateway = (gatewayId?: string | null): PaymentGatewayPlugin | undefined => {
    return gatewayId ? gatewayPlugins.value.get(gatewayId) : undefined;
  };

  const setActiveGateway = async (gateway?: PaymentGateway | string | null): Promise<void> => {
    const nextGatewayId = typeof gateway === 'string' ? gateway : (gateway?.id ?? null);
    if (activeGatewayId.value === nextGatewayId) return;

    const previousGateway = getGateway(activeGatewayId.value);
    if (previousGateway?.onDeselect) await previousGateway.onDeselect();

    activeGatewayId.value = nextGatewayId;

    const nextGateway = getGateway(nextGatewayId);
    if (nextGateway?.onSelect) {
      await nextGateway.onSelect(gateway);
    }
  };

  const activeGateway = computed(() => getGateway(activeGatewayId.value));

  const isActiveGatewayReady = computed<boolean>(() => {
    const gateway = activeGateway.value;
    return gateway?.isReady ? gateway.isReady() : true;
  });

  const getActiveGatewayDisabledMessage = (): string => {
    const gateway = activeGateway.value;
    return gateway?.getDisabledMessage?.() ?? '';
  };

  const resetActiveGateway = (): void => {
    activeGateway.value?.reset?.();
  };

  const processActiveGatewayPayment = async (): Promise<PaymentGatewayProcessResult> => {
    const gateway = activeGateway.value;
    if (!gateway?.processPayment) return { success: true, isPaid: false };
    return await gateway.processPayment();
  };

  return {
    registerGateway,
    getGateway,
    setActiveGateway,
    isActiveGatewayReady,
    getActiveGatewayDisabledMessage,
    resetActiveGateway,
    processActiveGatewayPayment,
  };
}
