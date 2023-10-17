import { z } from 'zod';

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional()
  })
});

const updateRole = z.object({
  body: z.object({
    role: z.string({
      required_error: 'Role must be provided'
    })
  })
});

export const AdminValidation = {
  update,
  updateRole
};
