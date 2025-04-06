import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Za-z]/, 'Password must contain a letter')
      .regex(/\d/, 'Password must contain a digit')
      .regex(/[@$!%*?&]/, 'Password must contain a special character'),
    confirmPassword: z.string(),
    agreement: z.literal(true).refine(val => val === true, {
      message: 'You must agree to the terms',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
