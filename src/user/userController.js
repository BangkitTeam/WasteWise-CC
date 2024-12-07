const { Router } = require("express");
const {
  getUserSettings,
  updateUserSettings,
  addFavorite,
  deleteFavorite,
  getAllFavorites,
} = require("./userService");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { updateSettingsSchema } = require("./userValidations");

const router = Router();

// Controller method to get the logged-in user's settings
router.get("/settings", authenticateJWT, async (req, res) => {
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
});

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

// Add a favorite
router.post("/favorites", authenticateJWT, async (req, res) => {
  const { userRecommendationId } = req.body; // Ensure this matches the request payload
  const userId = req.user.id;

  try {
    // Check if userRecommendationId is provided
    if (!userRecommendationId) {
      return res
        .status(400)
        .json({ error: "userRecommendationId is required" });
    }

    const favorite = await addFavorite(userId, userRecommendationId);
    res.status(201).json({ message: "Favorite added successfully", favorite });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Favorite
router.delete(
  "/favorites/:id",
  authenticateJWT,
  async (req, res) => {
    const favoriteId = req.params.id;
    const userId = req.user.id;

    try {
      await deleteFavorite(userId, favoriteId);
      res.status(200).json({ message: "Favorite deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Show all favorites
router.get("/favorites", authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const favorites = await getAllFavorites(userId);
    res.status(200).json({ favorites });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
