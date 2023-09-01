import * as Joi from "joi";

export const VALIDATION_SCHEMA = Joi.object({
    PORT: Joi.number().port().default(3000),
})