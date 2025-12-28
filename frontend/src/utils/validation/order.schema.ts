import { z } from 'zod';
import { PaymentMethod } from '@/types/api/order';

export const createOrderSchema = z.object({
  delivery_address_id: z
    .string()
    .uuid('Invalid address selected'),
  payment_method: z.nativeEnum(PaymentMethod),
  voucher_code: z
    .string()
    .toUpperCase()
    .optional(),
  special_instructions: z
    .string()
    .max(500, 'Instructions are too long')
    .optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
