import { z } from 'zod';

export const restRequestSchema = z
  .object({
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    url: z.string().url(),
    headers: z.array(
      z.object({
        key: z
          .string()
          .trim()
          .regex(/^[A-Za-z0-9-]+$/, {
            message: 'Invalid header name',
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
          message: 'Invalid JSON',
        });
      }
    }
  });
