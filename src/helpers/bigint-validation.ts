import Joi from "@hapi/joi";

// Here it's better to infer return type
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const BigIntValidation = () =>
  Joi.extend({
    type: "bigint",
    coerce: {
      from: "string",
      method(value, { error }) {
        try {
          return { value: BigInt(value) };
        } catch (err) {
          return { errors: [error("bigint.err", err)] };
        }
      }
    },
    messages: {
      "bigint.err": "{{#label}} {{#message}}"
    }
  }).bigint();
