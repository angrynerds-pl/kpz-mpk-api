import { ServerRoute, RouteOptions } from "@hapi/hapi";
import { staticRoutes } from "./static";
import { incidentRoutes } from "./incidents";
import { timeTableRoutes } from "./timetable";

export const routes: ServerRoute[] = [
  ...staticRoutes,
  ...incidentRoutes,
  ...timeTableRoutes
];

/**
 * This function is passed to JSON.stringify as a second argument
 * Thanks to that we are able to use BigInt internally
 */
function replacer<T>(_key: string, value: T): T | string {
  if (typeof value === "bigint") {
    return value.toString();
  }

  return value;
}

/* eslint-disable no-param-reassign */
routes.forEach(route => {
  if (route.options === undefined) {
    route.options = {};
  }

  // eslint-disable-next-line no-param-reassign
  route.options = {
    json: {
      replacer,
      ...((route.options as RouteOptions)?.json || {})
    },
    ...(route.options || {})
  };
});
