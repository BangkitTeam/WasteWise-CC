const Joi = require("joi");

const uploadSchema = Joi.object({
  description: Joi.string().optional(), 
});

module.exports = { uploadSchema };
