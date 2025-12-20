import { z } from 'zod';

export const addressSchema = z.object({
  label: z
    .string()
    .min(1, 'Label is required')
    .max(50, 'Label is too long'),
  address_line: z
    .string()
    .min(1, 'Address is required')
    .max(500, 'Address is too long'),
  city: z
    .string()
    .min(1, 'City is required'),
  district: z
    .string()
    .min(1, 'District is required'),
  ward: z
    .string()
    .min(1, 'Ward is required'),
  latitude: z
    .number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  longitude: z
    .number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
  is_default: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
