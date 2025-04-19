import { z } from 'zod';
import { TFunction } from 'i18next';

export const createRestRequestSchema = (t: TFunction) =>
  z
    .object({
      method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
      url: z.string().url(t('validation.url')),
      headers: z.array(
        z.object({
          key: z
            .string()
            .trim()
            .regex(/^[A-Za-z0-9-]+$/, {
              message: t('validation.headerKey'),
            }),
          value: z.string().trim(),
        })
      ),
      bodyType: z.enum(['text', 'json']),
      body: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.bodyType === 'json') {
        try {
          JSON.parse(data.body);
        } catch {
          ctx.addIssue({
            path: ['body'],
            code: z.ZodIssueCode.custom,
            message: t('validation.invalidJson'),
          });
        }
      }
    });

export const restRequestSchemaBase = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  url: z.string().url(),
  headers: z.array(
    z.object({
      key: z.string().trim(),
      value: z.string().trim(),
    })
  ),
  bodyType: z.enum(['text', 'json']),
  body: z.string(),
});

export type RestRequestSchemaType = z.infer<typeof restRequestSchemaBase>;
