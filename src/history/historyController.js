
const { getUserRecommendationHistory, deleteHistoryById, deleteAllHistoryByUserId, } = require('./historyService');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();

// Endpoint mengambil riwayat rekomendasi berdasarkan userId
router.get("/user", authenticateJWT, async (req, res) => {
  const userId = req.user.id;  
  
  try {
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

router.delete('/histories/:id', authenticateJWT, async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const userId = req.user.id; 
    const result = await deleteHistoryById(id, userId); 
    if (!result) {
      return res.status(404).json({ message: "History not found or not authorized to delete." });
    }

    res.status(200).json({ message: "History deleted successfully." });
  } catch (error) {
    console.error('Error deleting history by ID:', error);
    res.status(500).json({ message: 'Failed to delete history.', error: error.message });
  }
});

// Delete All History
router.delete('/histories/user/:userId', authenticateJWT, async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user.id; 

  if (Number(userId) !== requesterId) {
    return res.status(403).json({ message: "Unauthorized to delete this user's history." });
  }

  try {
    const result = await deleteAllHistoryByUserId(Number(userId), requesterId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
