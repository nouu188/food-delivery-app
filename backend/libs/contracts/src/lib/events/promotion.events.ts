export class VoucherUsedEvent {
  constructor(
    public readonly voucherId: string,
    public readonly userId: string,
    public readonly orderId: string,
    public readonly discountApplied: number,
  ) {}
}

export class VoucherExpiredEvent {
  constructor(
    public readonly voucherId: string,
    public readonly code: string,
  ) {}
}
