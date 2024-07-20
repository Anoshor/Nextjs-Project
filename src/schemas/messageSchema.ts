import {z} from 'zod';

export const MessageSchema = z.object({
    content: z.string().min(10, "Content must be atleast 10 chars").max(1000, "Content must be atmost 300 chars"),
})