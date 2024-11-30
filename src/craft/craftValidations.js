const Joi = require("joi");

// Validasi untuk menambahkan Craft
const createCraftSchema = Joi.object({
  title: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title must have at least 3 characters",
    "string.max": "Title can have at most 50 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().min(10).max(300).required().messages({
    "string.empty": "Description cannot be empty",
    "string.min": "Description must have at least 10 characters",
    "string.max": "Description can have at most 300 characters",
    "any.required": "Description is required",
  }),
});

module.exports = { createCraftSchema };
