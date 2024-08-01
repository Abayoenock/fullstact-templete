const { z } = require("zod")
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const passwordSchema = z
  .string()
  .regex(
    passwordRegex,
    "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
  )
// schema for validating email address
const emailSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
})
const loginSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
  password: z.string({}).min(1, { message: "Password is required " }),
})
const createAccountSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),

  firstname: z
    .string({
      message: "firstname must be a string ",
    })
    .min(2, { message: "First name must be atleast two characters long " }),
  lastname: z
    .string({
      message: "Lastname must be a string ",
    })
    .min(2, { message: "Lastname must be atleast two characters long " }),
  password: passwordSchema,
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Format the phone number correctly, must start with country code",
  }),
})
const updateAccountSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),

  firstname: z
    .string({
      message: "firstname must be a string ",
    })
    .min(2, { message: "First name must be atleast two characters long " }),
  lastname: z
    .string({
      message: "Lastname must be a string ",
    })
    .min(2, { message: "Lastname must be atleast two characters long " }),

  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Format the phone number correctly, must start with country code",
  }),
})
const passwordResetSchema = z
  .object({
    currentPassword: z.string({
      message: "current Password is required and must be a string",
    }),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  })

const forgotPasswordResetSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  })

module.exports = {
  loginSchema,
  createAccountSchema,
  passwordResetSchema,
  emailSchema,
  forgotPasswordResetSchema,
  updateAccountSchema,
}
