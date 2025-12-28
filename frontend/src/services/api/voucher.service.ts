import apiClient from './client';
import {
  Voucher,
  VoucherValidationRequest,
  VoucherValidationResponse,
  GetAvailableVouchersParams,
} from '@/types/api/voucher';

class VoucherService {
  async getAvailableVouchers(params?: GetAvailableVouchersParams): Promise<Voucher[]> {
    const response = await apiClient.get<Voucher[]>('/vouchers', { params });
    return response.data;
  }

  async getVoucherByCode(code: string): Promise<Voucher> {
    const response = await apiClient.get<Voucher>(`/vouchers/${code}`);
    return response.data;
  }

  async validateVoucher(data: VoucherValidationRequest): Promise<VoucherValidationResponse> {
    const response = await apiClient.post<VoucherValidationResponse>('/vouchers/validate', data);
    return response.data;
  }
}

export default new VoucherService();
