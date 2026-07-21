import { z } from "zod";

export const registerUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .trim(),

  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .trim(),

  avatar: z
    .string()
    .url("Avatar must be a valid URL").optional(),

  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password cannot exceed 50 characters"),
});


export const loginUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});


export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .trim()
    .optional(),

  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .optional(),

  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional(),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z
      .string()
      .min(1, "Old password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .max(100, "New password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "New password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

export const updateUserProfileSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .optional(),

    email: z
      .email("Invalid email address")
      .trim()
      .toLowerCase()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field (username or email) must be provided",
    }
  );

  // Type inference
export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;