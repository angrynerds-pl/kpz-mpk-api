import Joi from "@hapi/joi";

// Here it's better to infer return type
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const GeoPointValidation = () =>
  Joi.object()
    .keys({
      longitude: Joi.number().required(),
      latitude: Joi.number().required()
    })
    .label("GeoPoint");