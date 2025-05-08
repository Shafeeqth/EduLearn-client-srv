import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email' }),
  username: z
    .string()
    .trim()
    .min(3, 'Name must be at least 8 characters long')
    .max(20, 'Name must be at most 20 characters long')
    .regex(
      /^[A-Za-z]+(?: [A-Za-z]+)?$/,
      'Name must contain only alphabets and numbers and one space between'
    ),
  password: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one numeric character' })
    .regex(/[\W_]/, { message: 'Password must contain at least one special character' }),
  // confirmPassword: z.string().trim().min(1, { message: 'Field required' }),
  // avatar: z.string().url({ message: 'Avatar must be a valid URL' }).optional(),
  acceptTerms: z
    .boolean()
    .default(true)
    .refine((data) => data === true, {
      message: 'You must accept terms and conditions',
    })
    .optional(),
});
// .strict()
// .refine((data) => data.password === data.confirmPassword, {
//   message: 'Passwords do not match',
//   path: ['confirmPassword'],
// });
export type RegisterSchemaType = z.infer<typeof registerSchema>;
