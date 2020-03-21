/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable global-require */
import { Server } from "@hapi/hapi";
import jwksRsa from "jwks-rsa";
import {
  HTTP_PORT,
  HTTP_HOST,
  DEVELOPMENT,
  JWKS_URI,
  AUTH0_AUDIENCE,
  AUTH0_ISSUER
} from "../config";
import { routes } from "../web/routes";
import { auth0ToCustomerId } from "../lib/customer/customers-service";
import { AuthorizedCredentials } from "./authorized-request";

export async function startServer(): Promise<void> {
  const server = new Server({
    port: HTTP_PORT,
    host: HTTP_HOST,
    debug: DEVELOPMENT ? { request: ["*"] } : undefined,

    routes: {
      validate: {
        failAction: require("relish")().failAction
      }
    }
  });

  await server.register(require("@hapi/vision"));
  await server.register(require("@hapi/inert"));
  await server.register(require("hapi-auth-jwt2"));

  await server.register({
    plugin: require("hapi-swagger"),
    options: { info: { title: "MPK Incidents docs" } }
  });

  await server.register({
    plugin: require("blipp"),
    options: { showAuth: true }
  });

  server.auth.strategy("auth0", "jwt", {
    complete: true,
    key: jwksRsa.hapiJwt2KeyAsync({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: JWKS_URI!
    }),
    async validate(claims: { [k: string]: string }) {
      if (!claims?.sub) return { isValid: false };

      const customerId = await auth0ToCustomerId(claims.sub);
      const credentials: AuthorizedCredentials = { customerId };

      return {
        isValid: true,
        credentials
      };
    },
    headerKey: "authorization",
    tokenType: "Bearer",
    verifyOptions: {
      audience: AUTH0_AUDIENCE,
      issuer: AUTH0_ISSUER,
      algorithms: ["RS256"]
    }
  });

  server.route(routes);

  await server.start();
}
