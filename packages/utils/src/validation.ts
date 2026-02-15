import { z } from "zod";

// Auth schemas
export const emailSchema = z.string().email("Invalid email address");

/**
 * Password validation schema with complexity requirements:
 * - Minimum 8 characters
 * - Maximum 100 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/,
    "Password must contain at least one special character"
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
});

// Organization schemas
export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(50, "Slug must be less than 50 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers, and hyphens"
  );

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: slugSchema,
  logo: z.string().url().optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: slugSchema.optional(),
  logo: z.string().url().nullable().optional(),
});

export const inviteMemberSchema = z.object({
  email: emailSchema,
  role: z.enum(["admin", "member"]),
});

// User schemas
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  image: z.string().url().nullable().optional(),
});

// Password strength checker
export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

/**
 * Checks password strength and provides feedback
 * @param password - The password to check
 * @returns PasswordStrengthResult with strength, score, and feedback
 */
export function checkPasswordStrength(
  password: string
): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  else if (password.length < 8) feedback.push("Use at least 8 characters");

  // Character type checks
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password);

  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  if (!hasUpper) feedback.push("Add uppercase letters");
  if (!hasLower) feedback.push("Add lowercase letters");
  if (!hasNumber) feedback.push("Add numbers");
  if (!hasSpecial) feedback.push("Add special characters (!@#$%^&*...)");

  // Determine strength
  let strength: PasswordStrength;
  if (score === 0 || score === 1) strength = "weak";
  else if (score === 2) strength = "fair";
  else if (score === 3 || score === 4) strength = "good";
  else strength = "strong";

  // Check if password meets all requirements
  const isValid = passwordSchema.safeParse(password).success;

  return {
    strength,
    score,
    feedback,
    isValid,
  };
}

// Utility types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
