const Joi = require("joi");

const craftSchema = Joi.object({
  wasteType: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Waste type cannot be empty",
    "string.min": "Waste type must have at least 3 characters",
    "string.max": "Waste type can have at most 50 characters",
    "any.required": "Waste type is required",
  }),
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
  imageUrl: Joi.string().uri().optional().messages({
    "string.uri": "Image URL must be a valid URI",
  }),
  tutorialUrl: Joi.string().uri().optional().messages({
    "string.uri": "Tutorial URL must be a valid URI",
  }),
});

const createCraftSchema = Joi.alternatives()
  .try(
    craftSchema, // Single object validation
    Joi.array().items(craftSchema) // Array of objects validation
  )
  .required();

module.exports = { createCraftSchema };
