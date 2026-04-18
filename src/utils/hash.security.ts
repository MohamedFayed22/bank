import { compareSync, hashSync } from "bcrypt";
import { salt_rounds_config } from "../config/config.service";

type CompareInput = {
  plainText: string;
  cipher_text: string;
};

type HashInput = {
  plainText: string;
  salt_rounds?: number | string;
};

export function Compare({ plainText, cipher_text }: CompareInput) {
  return compareSync(plainText, cipher_text);
}

export function Hash({
  plainText,
  salt_rounds = salt_rounds_config,
}: HashInput) {
  return hashSync(plainText, salt_rounds);
}
