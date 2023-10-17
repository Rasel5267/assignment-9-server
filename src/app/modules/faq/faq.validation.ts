import { z } from 'zod';

const create = z.object({
  body: z.object({
    question: z.string({
      required_error: 'Question must be provided'
    }),
    answer: z.string({
      required_error: 'Answer must be provided'
    })
  })
});

const update = z.object({
  body: z.object({
    question: z.string().optional(),
    answer: z.string().optional()
  })
});

export const FAQValidation = {
  create,
  update
};
