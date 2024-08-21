import { z } from 'zod';

export const signInSchemaValidation = z.object({
    identifier: z.string(),
    password: z.string(),
})