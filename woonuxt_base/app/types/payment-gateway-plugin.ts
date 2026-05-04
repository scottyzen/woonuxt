import type { Component } from 'vue';
import type { PaymentGateway } from '#types/gql';

export type PaymentGatewayEventHandlers = Record<string, (...args: unknown[]) => void>;

export type PaymentGatewayProcessResult = {
  success: boolean;
  isPaid: boolean;
  error?: string;
};

export type PaymentGatewayOption = {
  id: string;
  gateway: PaymentGateway;
  title: string;
  description?: string | null;
  icon?: string | null;
  iconName?: string;
  details?: string[];
  badge?: string | null;
  sortOrder?: number;
  isSelected?: boolean;
  onSelect?: () => void | Promise<void>;
};

export type PaymentGatewayPlugin = {
  id: string;
  name?: string;
  icon?: string | ((gateway: PaymentGateway) => string | null);
  iconName?: string;
  component?: Component;
  getPaymentOptions?: (gateway: PaymentGateway) => PaymentGatewayOption[];
  isReady?: () => boolean;
  getDisabledMessage?: () => string;
  getComponentProps?: () => Record<string, unknown>;
  getComponentEvents?: () => PaymentGatewayEventHandlers;
  onSelect?: (gateway?: PaymentGateway | string | null) => void | Promise<void>;
  onDeselect?: () => void | Promise<void>;
  reset?: () => void;
  processPayment?: () => Promise<PaymentGatewayProcessResult>;
};
