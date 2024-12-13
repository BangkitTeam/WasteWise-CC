const { Router } = require("express");
const { authenticateJWT } = require('../middlewares/authMiddleware');
const {
  getAllFavorites,
  getFavoritesById,
  addFavorite,
  updateFavorite,
  deleteFavorite,
} = require("./favoriteService");

const router = Router();

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; 
    const favorites = await getFavoritesById(userId); 
    if (!favorites || favorites.length === 0) {
      return res.status(404).json({
        message: "No favorites found",
        status: 404,
      });
    }
    res.status(200).json({
      data: favorites,
      message: "Successfully got the data",
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

// Get all favorites (admin or for debugging purposes)
router.get("/all", authenticateJWT, async (req, res) => {
  try {
    const allFavorites = await getAllFavorites();
    res.status(200).json({
      data: allFavorites,
      message: "Successfully got all the data",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get all data",
      error: error.message,
      status: 500,
    });
  }
});

router.post("/add-favorite", authenticateJWT, async (req, res) => {
  const { recommendationId } = req.body;
  const userId = req.user.id;

  try {
    const newFavorite = await addFavorite(userId, recommendationId);
    res.status(201).json({
      data: newFavorite,
      message: "Favorite added successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

router.put("/update-favorite/:id", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const favoriteId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedFavorite = await updateFavorite(userId, favoriteId, updatedData);
    res.status(200).json({
      data: updatedFavorite,
      message: "Favorite updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

router.delete("/delete-favorite/:id", authenticateJWT, async (req, res) => {
  const favoriteId = req.params.id; 
  const userId = req.user.id; 

  try {
    await deleteFavorite(userId, favoriteId);
    res.status(200).json({
      message: "Favorite deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete favorite",
      error: error.message,
    });
  }
});

module.exports = router;
