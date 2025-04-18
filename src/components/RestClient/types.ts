import { z } from 'zod';
import { restRequestSchemaBase } from './restRequestSchema';

export type RestRequestSchemaType = z.infer<typeof restRequestSchemaBase>;
