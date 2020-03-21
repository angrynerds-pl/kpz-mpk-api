import Joi from "@hapi/joi";

// Here it's better to infer return type
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const StringIntValidation = () => Joi.string().regex(/^\d+$/);
