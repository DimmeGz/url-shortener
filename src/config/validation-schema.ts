import * as Joi from 'joi';

export const VALIDATION_SCHEMA = Joi.object({
  PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().ip().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});
