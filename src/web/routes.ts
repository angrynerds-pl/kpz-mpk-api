import { ServerRoute } from "@hapi/hapi";
import { staticRoutes } from "./static";
import { incidentRoutes } from "./incidents";

export const routes: ServerRoute[] = [...staticRoutes, ...incidentRoutes];
