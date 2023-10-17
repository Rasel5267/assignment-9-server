import { z } from 'zod';

const create = z.object({
  body: z.object({
    packageName: z.string({
      required_error: 'Package name must be provided'
    }),
    description: z.string({
      required_error: 'Package description must be provided'
    }),
    activities: z.any({
      required_error: 'Activities must be provided'
    }),
    totalCapacity: z.number({}).optional(),
    duration: z.number({
      required_error: 'Duration must be provided'
    }),
    price: z.number({
      required_error: 'Price must be provided'
    }),
    destinationId: z.string({
      required_error: 'Destination Id must be provided'
    })
  })
});

const update = z.object({
  body: z.object({
    packageName: z.string().optional(),
    description: z.string().optional(),
    totalCapacity: z.number({}).optional(),
    duration: z.number().optional(),
    price: z.number().optional()
  })
});

const updateStatus = z.object({
  body: z.object({
    status: z.string({
      required_error: 'Status must be provided'
    })
  })
});

export const TourPackageValidation = {
  create,
  update,
  updateStatus
};
