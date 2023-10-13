import { z } from 'zod';

const update = z.object({
  body: z.object({
    email: z.string().optional(),
    name: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional()
  })
});

export const CustomerValidation = {
  update
};
