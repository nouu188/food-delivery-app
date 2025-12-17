export const PROMOTION_PATTERNS = {
  GET_AVAILABLE_VOUCHERS: { cmd: 'promotion.voucher.available.get' },
  GET_VOUCHER_BY_CODE: { cmd: 'promotion.voucher.code.get' },
  VALIDATE_VOUCHER: { cmd: 'promotion.voucher.validate' },
  CREATE_VOUCHER: { cmd: 'promotion.voucher.create' },
  UPDATE_VOUCHER: { cmd: 'promotion.voucher.update' },
  DEACTIVATE_VOUCHER: { cmd: 'promotion.voucher.deactivate' },
} as const;
