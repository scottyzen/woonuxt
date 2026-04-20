import type { Viewer } from '#types/gql';

export type SavedPaymentMethod = {
  id: number;
  token: string;
  customerId?: string | null;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: string;
  isDefault: boolean;
};

export type CheckoutViewer = Viewer & {
  stripeCustomerId?: string | null;
  savedPaymentMethods?: SavedPaymentMethod[] | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  databaseId?: number | null;
};

export type StripePaymentDefaults = {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
};
