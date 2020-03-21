import { ValueTransformer } from "typeorm";
import { Point } from "./point";

export const pointTransformer: ValueTransformer = {
  from: (db): Point => ({ latitude: db.y, longitude: db.x }),
  to: (point: Point): string => `${point.longitude}, ${point.latitude}`
};
