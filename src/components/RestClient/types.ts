import { z } from 'zod';
import { restRequestSchema } from './restRequestSchema';

export type RestRequestSchemaType = z.infer<typeof restRequestSchema>;
