const express = require("express");
const router = express.Router();
const { getUserRecommendationHistory, deleteRecommendationById } = require("./historyService");
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Middleware untuk autentikasi JWT pada rute yang memerlukan autentikasi
router.use(authenticateJWT);

// Controller untuk mendapatkan riwayat rekomendasi berdasarkan userId
router.get("/recommendation", async (req, res) => {
  const userId = req.user.id;  // Mengambil userId dari token JWT yang sudah di-decode oleh middleware

  try {
    const recommendations = await getUserRecommendationHistory(userId);
    return res.status(200).json({
      message: "Recommendation history fetched successfully.",
      data: recommendations,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch recommendation history.",
      error: error.message,
    });
  }
});

// Controller untuk menghapus rekomendasi berdasarkan ID
router.delete("/delete-recommendation/:id", async (req, res) => {
  const id = parseInt(req.params.id);  // Mengakses ID dari parameter URL dan memastikan menjadi integer
  const userId = req.user.id; // Mengambil userId dari request (JWT)

  console.log(`Request to delete recommendation with id: ${id}, by userId: ${userId}`); // Log ID dan userId

  if (!userId) {
    console.log("Error: userId is missing");  // Log jika userId tidak ada
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const result = await deleteRecommendationById(id, userId);
    if (result === null) {
      console.log(`Recommendation with id ${id} not found for userId ${userId}`);  // Log jika tidak ditemukan
      return res.status(404).json({ message: "Recommendation not found." });
    }
    console.log(`Recommendation with id ${id} successfully deleted by userId ${userId}`);  // Log sukses
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error during delete operation: ${error.message}`); // Log error jika terjadi kesalahan
    return res.status(500).json({
      message: "Failed to delete recommendation.",
      error: error.message,
    });
  }
});


module.exports = router;
