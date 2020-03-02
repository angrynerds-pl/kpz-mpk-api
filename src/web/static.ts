import { ServerRoute } from "@hapi/hapi";

export const staticRoutes: readonly ServerRoute[] = [
  {
    method: "get",
    path: "/",
    options: {
      description: "Health check"
    },
    handler: () => "ok"
  }
];
