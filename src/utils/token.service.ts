import jwt, {
  type JwtPayload,
  type Secret,
  type SignOptions,
  type VerifyOptions,
} from "jsonwebtoken";

type GenerateTokenInput = {
  payload: string | Buffer | object;
  secret_key: Secret;
  options?: SignOptions;
};

type VerifyTokenInput = {
  token: string;
  secret_key: Secret;
  options?: VerifyOptions;
};

export const generateToken = ({
  payload,
  secret_key,
  options = {},
}: GenerateTokenInput) => {
  return jwt.sign(payload, secret_key, options);
};

export const verifyToken = ({
  token,
  secret_key,
  options = {},
}: VerifyTokenInput): string | JwtPayload => {
  return jwt.verify(token, secret_key, options);
};


