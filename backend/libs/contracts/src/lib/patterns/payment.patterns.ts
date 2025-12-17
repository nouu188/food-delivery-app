export const PAYMENT_PATTERNS = {
  PROCESS_PAYMENT: { cmd: 'payment.process' },
  GET_PAYMENT_DETAILS: { cmd: 'payment.details.get' },
  PROCESS_REFUND: { cmd: 'payment.refund.process' },
  GET_WALLET: { cmd: 'payment.wallet.get' },
  TOP_UP_WALLET: { cmd: 'payment.wallet.topup' },
  GET_WALLET_TRANSACTIONS: { cmd: 'payment.wallet.transactions.get' },
} as const;
