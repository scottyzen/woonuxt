# Payment Gateway Plugins

Each payment gateway implements the `PaymentGatewayPlugin` interface and registers itself with `usePaymentGateways()` from its own Nuxt plugin file.

The checkout page should only coordinate the selected gateway. Gateway-specific UI, validation, readiness, reset, and client-side payment processing belong in these plugins.

Current built-in plugins:

- `stripe.ts`: Stripe Payment Element, saved card support, and Stripe order metadata.
- `paypal.ts`: PayPal and PPCP redirect gateways. Current redirect handling stays in `useCheckout()`.
- `cod.ts`: Cash on delivery.
- `cheque.ts`: Cheque payments.

New gateways should export a `PaymentGatewayPlugin` object or a factory that returns one. The plugin can also provide `icon` or `iconName` so generic checkout UI does not need gateway-specific conditions.

To enable a gateway, add its plugin file to `woonuxt_base/nuxt.config.ts`:

```ts
plugins: [
  resolve('./app/plugins/init.ts'),
  resolve('./app/plugins/payment-gateways/stripe.ts'),
  resolve('./app/plugins/payment-gateways/paypal.ts'),
  resolve('./app/plugins/payment-gateways/cod.ts'),
  resolve('./app/plugins/payment-gateways/cheque.ts'),
];
```

To add a new gateway, create `your-gateway.ts`, register it inside `defineNuxtPlugin()`, then add that file to the plugin list.
