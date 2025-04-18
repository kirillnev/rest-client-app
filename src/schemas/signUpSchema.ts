import { z } from 'zod';
import { TFunction } from 'i18next';

export const getSignUpSchema = (t: TFunction) =>
  z
    .object({
      email: z.string().email(t('auth.validation.email')),
      password: z
        .string()
        .min(8, t('auth.validation.password.min'))
        .regex(/[A-Za-z]/, t('auth.validation.password.letter'))
        .regex(/\d/, t('auth.validation.password.digit'))
        .regex(/[@$!%*?&]/, t('auth.validation.password.special')),
      confirmPassword: z.string(),
      agreement: z.boolean().refine((val) => val === true, {
        message: t('auth.validation.agreement'),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.validation.password.match'),
      path: ['confirmPassword'],
    });

export type SignUpSchemaType = z.infer<ReturnType<typeof getSignUpSchema>>;
