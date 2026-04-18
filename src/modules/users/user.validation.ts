import { z } from "zod";

export const disableAccountSchema = {
  body: z.object({
    accountNumber: z.string(),
  }),
};
