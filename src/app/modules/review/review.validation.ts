import z from 'zod';

const create = z.object({
  body: z.object({
    rating: z.string({
      required_error: 'Rating must be provided'
    }),
    comment: z.string({
      required_error: 'Comment must be provided'
    }),
    tourPackageId: z.string({
      required_error: 'TourPackage Id must be provided'
    })
  })
});

const update = z.object({
  body: z.object({
    rating: z.string().optional(),
    comment: z.string().optional(),
    tourPackageId: z.string().optional()
  })
});

export const ReviewValidation = {
  create,
  update
};
