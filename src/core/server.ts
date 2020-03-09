/* eslint-disable global-require */
import { Server } from "@hapi/hapi";
import { HTTP_PORT, HTTP_HOST, DEVELOPMENT } from "../config";
import { routes } from "../web/routes";

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

  await server.register({
    plugin: require("hapi-swagger"),
    options: { info: { title: "MPK Incidents docs" } }
  });

  await server.register({
    plugin: require("blipp"),
    options: { showAuth: true }
  });

  server.route(routes);

  await server.start();
}
