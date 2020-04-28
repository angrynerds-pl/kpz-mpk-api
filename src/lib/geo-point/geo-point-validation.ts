// Here it's better to infer return type
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import Joi from "@hapi/joi";

const GeoPointCoordinate = () =>
  Joi.number()
    .unsafe()
    .required();

export const GeoPointValidation = () =>
  Joi.object()
    .keys({
      longitude: GeoPointCoordinate()
        .min(-180)
        .max(180),
      latitude: GeoPointCoordinate()
        .min(-90)
        .max(90)
    })
    .label("GeoPoint");
