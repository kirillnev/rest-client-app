import { z } from 'zod';
import { TFunction } from 'i18next';

export const getSignInSchema = (t: TFunction) =>
  z.object({
    email: z.string().email(t('auth.validation.email')),
    password: z
      .string()
      .min(8, t('auth.validation.password.min'))
      .regex(/[A-Za-z]/, t('auth.validation.password.letter'))
      .regex(/\d/, t('auth.validation.password.digit'))
      .regex(/[@$!%*?&]/, t('auth.validation.password.special')),
  });

export type SignInSchemaType = z.infer<ReturnType<typeof getSignInSchema>>;
