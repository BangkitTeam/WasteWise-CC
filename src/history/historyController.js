const { getUserRecommendationHistory } = require('./historyService');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();

// Endpoint untuk mengambil riwayat rekomendasi berdasarkan userId
router.get("/", authenticateJWT, async (req, res) => {
  const userId = req.user.id;  // Mendapatkan userId dari JWT token yang sudah di-authenticate
  
  try {
    // Mengambil riwayat rekomendasi pengguna
    const history = await getUserRecommendationHistory(userId);
    
    if (!history || history.length === 0) {
      return res.status(404).json({
        message: "No recommendation history found for this user.",
      });
    }

    res.json({
      message: "Recommendation history fetched successfully.",
      data: history,
    });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
