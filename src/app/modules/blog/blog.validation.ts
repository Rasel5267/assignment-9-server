import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title must be provided'
    }),
    description: z.string({
      required_error: 'Description must be provided'
    })
  })
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional()
  })
});

export const BlogValidation = {
  create,
  update
};
