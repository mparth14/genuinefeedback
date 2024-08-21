import { z } from 'zod';

export const messageValidation = z.object({
    content: z
        .string()
        .min(10, {message: "Message must be atleast 10 characters long"})
        .max(300, {message: "Message must be atleast 300 characters long"})
})