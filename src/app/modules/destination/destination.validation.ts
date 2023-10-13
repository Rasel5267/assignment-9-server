import { z } from 'zod';

const create = z.object({
  body: z.object({
    destinationName: z.string({
      required_error: 'Destination name must be provided'
    }),
    description: z.string({
      required_error: 'Description must be provided'
    }),
    imageUrl: z.string({
      required_error: 'Image URL must be provided'
    })
  })
});

const update = z.object({
  body: z.object({
    destinationName: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional()
  })
});

export const DestinationValidation = {
  create,
  update
};
