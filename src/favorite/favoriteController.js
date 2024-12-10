const { Router } = require("express");
const { authenticateJWT } = require('../middlewares/authMiddleware');
const {
  getUserFavorites,
  markRecommendationAsFavorite,
  unmarkRecommendationAsFavorite,
} = require("./favoriteService");

const router = Router();

// GET ALL favorites
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; 
    const favorites = await getUserFavorites(userId); 
    if (!favorites || favorites.length === 0) {
      return res.status(404).json({
        message: "No favorites found",
        status: 404,
      });
    }
    res.status(200).json({
      data: favorites,
      message: "Successfully get the data",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get data",
      error: error.message,
      status: 500,
    });
  }
});

// ADD favorite
router.post("/mark-favorite/:id", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const recommendationId = req.params.id;

  try {
    const newFavorite = await markRecommendationAsFavorite(userId, recommendationId);
    res.status(201).json({
      data: newFavorite,
      message: "Recommendation marked as favorite successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// Unmark
router.delete("/mark-non-favorite/:id", authenticateJWT, async (req, res) => {
  const favoriteId = parseInt(req.params.id, 10); // Ambil id favorite dari params
  const userId = req.user.id; // Ambil userId dari token JWT

  if (isNaN(favoriteId)) {
    return res.status(400).json({
      message: "Invalid favorite ID",
    });
  }

  try {
    const response = await unmarkRecommendationAsFavorite(favoriteId, userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus favorite.",
      error: error.message,
    });
  }
});

module.exports = router;
