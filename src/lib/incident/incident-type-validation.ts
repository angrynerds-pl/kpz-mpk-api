import Joi from "@hapi/joi";
import { IncidentType } from "./incident-type";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const IncidentTypeValidation = () =>
  Joi.string()
    .valid(...Object.values(IncidentType))
    .label("IncidentType");
