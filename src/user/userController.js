const { Router } = require("express");
const { getUserSettings, updateUserSettings } = require("./userService");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { updateSettingsSchema } = require("./userValidations");

const router = Router();

// Controller method to get the logged-in user's settings
router.get(
  "/settings",
  authenticateJWT,
  async (req, res) => {
    try {
      const userId = req.user?.id; 

      if (!userId) throw res.status(400).json({ error: "User ID is required" });

      const userSettings = await getUserSettings(userId);

      res.status(200).json({
        username: userSettings.username,
        email: userSettings.email,
        password: userSettings.password, 
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.post(
  "/settings",
  authenticateJWT,
  validateRequest(updateSettingsSchema),
  async (req, res) => {
    const { username, email, password } = req.body;
    const userId = req.user.id;

    try {
      const updatedUser = await updateUserSettings(userId, {
        username,
        email,
        password,
      });

      res
        .status(200)
        .json({ message: "Settings updated successfully", updatedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
