require("dotenv").config();

export const {
  DATABASE_URL,
  JWKS_URI,
  AUTH0_AUDIENCE,
  AUTH0_ISSUER
} = process.env;

export const HTTP_PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
export const HTTP_HOST = process.env.HOST ?? "localhost";
export const DEVELOPMENT = process.env.DEVELOPMENT === "true";
export const DATABASE_SYNC = process.env.DATABASE_SYNC === "true";
