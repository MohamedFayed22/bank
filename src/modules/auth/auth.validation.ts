import { z } from "zod";

export const singUpSchema = {
  body: z
    .object({
      fullName: z
        .string({
          error: "fullName must be a required",
        })
        .min(3)
        .max(25),
      email: z.string().email(),
      password: z.string().min(6),
      cpassword: z.string().min(6),
      age: z.number().min(18).max(60),
      currency: z.string().min(1),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.cpassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords do not match",
          path: ["cpassword"],
        });
      }
      if (data.fullName.split(" ").length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "fullName must contain at least two words",
          path: ["fullName"],
        });
      }
    }),
};

export const singInSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
};

export type ISingUpType = z.infer<typeof singUpSchema.body>;
export type ISingInSchema = z.infer<typeof singInSchema.body>;
