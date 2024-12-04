// Validation middleware function
const validateRequest = (schema) => {
  return (req, res, next) => {
    // Validate the request body using the provided schema
    const { error } = schema.validate(req.body);

    if (error) {
      // If validation fails, send a 400 response with the error details
      throw res.status(400).json({ error: error.details[0].message });
    }

    // Proceed to the next middleware or controller if validation succeeds
    next();
  };
};

module.exports = { validateRequest };
