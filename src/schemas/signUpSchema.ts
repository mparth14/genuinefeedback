import { z } from 'zod';

export const usernameValidation  = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(15, "Username must not be no more than 15 characters")

export const signUpSchemaValidation = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Please enter a valid email address'}),
    password: z.string().min(6, {message: 'Password must be atleast 6 characters'})
})