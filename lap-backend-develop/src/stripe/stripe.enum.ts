export enum WebhookEvents {
  ChargeSucceeded = 'charge.succeeded',
  ChargeFailed = 'charge.failed',
  SetupIntentSucceeded = 'setup_intent.succeeded',
  PaymentIntentCreated = 'payment_intent.created',
  PaymentIntentSucceeded = 'payment_intent.succeeded',
  PaymentIntentFailed = 'payment_intent.payment_failed',
  CapabilityUpdated = 'capability.updated',
  PaymentIntentAmountCapturableUpdated = 'payment_intent.amount_capturable_updated',
  PaymentIntentCanceled = 'payment_intent.canceled',
  ChargeRefunded = 'charge.refunded',
  ChargeExpired = 'charge.expired',
  ChargeCaptured = 'charge.captured',
  BalanceAvailable = 'balance.available',
  ChargePending = 'charge.pending',
}

export enum ChargeFailErrorCodes {
  AuthenticationRequired = 'authentication_required',
  CardDeclined = 'card_declined',
}

export enum ConnectAccountStatuses {
  Inactive = 0,
  Active = 1,
  Pending = 2,
  Disabled = 3,
  UnRequested = 4,
}

export enum PayoutStatusEnum {
  'UnPaid' = 1,
  'Paid' = 2,
  'Failed' = 3,
}
