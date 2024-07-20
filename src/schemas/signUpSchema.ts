import {z} from 'zod';


export const usernameValidation = z.string().min(2, "Username must be atleast 2 chars").max(20, "Username must be atmost 20 chars")
.regex(/^[a-zA-Z0-9_]*$/, "Username must contain only alphabets, numbers and underscore");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be atleast 8 chars"),
})