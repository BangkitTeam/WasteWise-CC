const Joi = require("joi");

const updateSettingsSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(), // You can change the password validation as per your requirements
});

module.exports = { updateSettingsSchema };
