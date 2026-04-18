import { z } from "zod";

export const depositSchema = {
  body: z.object({
    amount: z.number().min(1),
    inSystem: z.string(),
  }),
};

export const withdrawSchema = {
  body: z.object({
    amount: z.number().min(1),
  }),
};

export const transferSchema = {
  body: z.object({
    amount: z.number().min(1),
    inSystem: z.string(),
    accountNumberTransformer: z.string(),
  }),
};
