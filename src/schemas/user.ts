import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string().min(5).max(20),
    email: z.string().email(),
    password: z.string().min(5).max(150),
    passwordConfirmation: z.string(),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        code: "custom",
        params: { i18n: "password_not_confirmed" },
        message: "Hasła się nie zgadzają",
        path: ["password"],
      });
    }
  });

export const signinSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(5).max(150),
});
