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
  wasteType: Joi.string()
    .valid("Plastic", "Paper", "Metal", "Glass", "Other")
    .required()
    .messages({
      "string.empty": "Waste type cannot be empty",
      "any.only":
        "Waste type must be one of [Plastic, Paper, Metal, Glass, Other]",
      "any.required": "Waste type is required",
    }),
  tutorialUrl: Joi.string().uri().optional().messages({
    "string.uri": "Tutorial URL must be a valid URL",
  }),
  imageUrl: Joi.string().optional().messages({
    "string.base": "Image must be a string",
  }),
});

module.exports = { createCraftSchema };
