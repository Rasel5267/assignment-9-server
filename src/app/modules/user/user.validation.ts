import { z } from 'zod';

const createCustomerZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password is required'
    }),
    customer: z.object({
      name: z.string({
        required_error: 'Name is required'
      }),
      email: z
        .string({
          required_error: 'Email is required'
        })
        .email(),
      contactNo: z.string({
        required_error: 'Contact number is required'
      }),
      address: z.string({
        required_error: 'Address is required'
      }),
      profileImage: z.string().optional()
    })
  })
});

const createAdminZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password is required'
    }),
    admin: z.object({
      name: z.string({
        required_error: 'Name is required'
      }),
      email: z
        .string({
          required_error: 'Email is required'
        })
        .email(),
      contactNo: z.string({
        required_error: 'Contact number is required'
      }),
      address: z.string({
        required_error: 'Address is required'
      }),
      profileImage: z.string().optional()
    })
  })
});

export const UserValidation = {
  createCustomerZodSchema,
  createAdminZodSchema
};
