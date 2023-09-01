import * as Joi from 'joi';

export const VALIDATION_SCHEMA = Joi.object({
  PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().ip().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  URL_LENGTH: Joi.number().required(),
  REDIS_HOST: Joi.string().ip().required(),
  REDIS_PORT: Joi.number().port().required(),
  REDIS_USERNAME: Joi.string().allow(null, '').optional(),
  REDIS_PASSWORD: Joi.string().allow(null, '').optional(),
  REDIS_DB_URLS: Joi.number().required(),
});
