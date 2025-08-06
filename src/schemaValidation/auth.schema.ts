import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^a-zA-Z0-9]/, "At least one special symbol");

export const RegisterBody = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterBodyType = z.infer<typeof RegisterBody>;

export const LoginBody = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required")
  })
  .strip();
export type LoginBodyType = z.infer<typeof LoginBody>;

export const ForgotPasswordBody = z
  .object({
    email: z.email("Invalid email address")
  })
  .strict();
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBody>;

export const ResetPasswordBody = z
  .object({
    email: z.email(),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: passwordSchema,
    confirmPassword: z.string()
  })
  .strict()
  .check((ctx) => {
    if (ctx.value.newPassword !== ctx.value.confirmPassword) {
      ctx.issues.push({
        code: "custom",
        message: `Password does not match`,
        input: ctx.value.confirmPassword
      });
    }
  });
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;

export const Customer = z.object({
  id: z.number().optional(),
  email: z.email(),
  fullName: z.string(),
  phone: z.string().nullable(),
  avatar: z.url().nullable(),
  address: z.string().nullable(),
}).strip();
export type CustomerType = z.infer<typeof Customer>;
export const CustomerLoginRes = z
  .object({
    customer: Customer,
    message: z.string()
  })
  .strip();
export type CustomerLoginResType = z.infer<typeof CustomerLoginRes>

export const Admin = z
  .object({
    id: z.coerce.number(),
    email: z.email(),
    fullName: z.string(),
    phone: z.string().nullable().optional(),
    avatar: z.url().nullable(),
    position: z.string().nullable(),
  }).strip();
export const AdminLoginRes = z
  .object({
    admin: Admin,
    message: z.string()
  })
  .strip();
export type AdminLoginResType = z.infer<typeof AdminLoginRes>

export const RegisterRes = z
  .object({
    customer: z.object({
      id: z.coerce.number(),
      email: z.email(),
      fullName: z.string(),
    }).strip(),
    message: z.string()
  })
  .strip();
export type RegisterResType = z.infer<typeof RegisterRes>
