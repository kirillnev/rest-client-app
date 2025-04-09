import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain a letter')
    .regex(/\d/, 'Password must contain a digit')
    .regex(/[@$!%*?&]/, 'Password must contain a special character'),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
