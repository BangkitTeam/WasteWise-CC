const { Router } = require("express");
const { registerUser, loginUser } = require("./authService");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { registerSchema, loginSchema } = require("./authValidations");

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const newUser = await registerUser(username, email, password);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.post(
  "/login",
  validateRequest(loginSchema),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const { token } = await loginUser(email, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
