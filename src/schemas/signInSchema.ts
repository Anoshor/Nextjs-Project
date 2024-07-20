import {z} from 'zod';

export const signInSchema = z.object({
    identifier: z.string().min(2, "Username must be atleast 2 chars").max(20, "Username must be atmost 20 chars"),
    password: z.string(),
})