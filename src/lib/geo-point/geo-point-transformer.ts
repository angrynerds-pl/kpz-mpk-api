import { ValueTransformer } from "typeorm";
import { GeoPoint } from "./geo-point";

export const GeoPointTransformer: ValueTransformer = {
  from: (db): GeoPoint => ({ latitude: db.y, longitude: db.x }),
  to: (point: GeoPoint): string => `${point.longitude}, ${point.latitude}`
};
