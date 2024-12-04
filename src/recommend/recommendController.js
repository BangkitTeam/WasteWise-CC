const express = require('express');
const { getRecommendationsBasedOnPrediction } = require('./recommendService');
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

// Endpoint 
router.get('/recommendations', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await getRecommendationsBasedOnPrediction(userId);

    if (!result || !result.recommendations || result.recommendations.length === 0) {
      return res.status(404).json({
        error: "No recommendations found for this user.",
      });
    }

    res.json({
      message: 'Recommendations fetched and saved successfully.',
      data: result,
    });
  } catch (error) {
    console.error('Error in recommendController:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
