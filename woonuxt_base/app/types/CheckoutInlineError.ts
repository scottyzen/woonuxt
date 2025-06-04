export class CheckoutInlineError extends Error {

    constructor(message?: string) {
        super(message);
        this.name = 'CheckoutInlineError';
    }
  }