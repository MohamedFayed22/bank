import { resolve } from "path";
import { config } from "dotenv";

const NODE_ENV = process.env.NODE_ENV || "development";
config({ path: resolve(__dirname, `.env.${NODE_ENV}`) });

export const PORT = Number(process.env.PORT) || 3000;

export const MONGO_URI: string =
  process.env.MONGO_URI || "mongodb://localhost:27017/bank";

export const salt_rounds_config = process.env.SALT_ROUNDS || 10;

export const secret_key_config = process.env.SECRET_KEY || "mohamed125";
