import z from 'zod';

const create = z.object({
  body: z.object({
    quantity: z.string({
      required_error: 'Quantity must be provided'
    }),
    tourPackageId: z.string({
      required_error: 'Quantity must be provided'
    })
  })
});

export const OrderValidation = {
  create
};
