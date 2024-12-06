const { Router } = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const {
  addFavorite,
  getUserFavorites,
  deleteFavorite,
} = require("./favoriteService");

const router = Router();
// GET ALL favorites
router.get("", authenticateJWT, async (req, res) => {
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
router.post("/", authenticateJWT, async (req, res) => {
  const favorite = req.body;

  try {
    const addedFavorite = await addFavorite(favorite);
    res.status(201).json({
      data: addedFavorite,
      message: "Favorite added successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// DELETE favorite
router.delete("/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
  
    try {
      const response = await deleteFavorite(Number(id));
      res.status(200).json({
        message: `Favorite id ${id} deleted successfully`,
        response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete favorite",
        error: error.message,
        status: 500,
      });
    }
  });
  

module.exports = router;
