// CSV

/*
const express = require('express');
const { getLatestPrediction, getCraftIdeas } = require('./recommendService');
const router = express.Router();

// API Endpoint to get recommendations based on the latest prediction
router.get('/recommend', async (req, res) => {
  try {
    // Step 1: Get the latest prediction from the database
    const prediction = await getLatestPrediction();

    // Step 2: Get craft ideas based on the predicted waste type
    const wasteType = prediction.prediction; // The type of waste predicted by the model
    const recommendations = await getCraftIdeas(wasteType); // Get recommendations based on waste type

    // Step 3: Return the prediction and recommendations
    return res.json({
      waste_type: wasteType,
      prediction_confidence: prediction.confidence,
      recommendations,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
*/

const express = require('express');
const { getRecommendationsBasedOnPrediction, saveUserRecommendation  } = require('./recommendService');
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

// Endpoint untuk mendapatkan rekomendasi berdasarkan prediksi terakhir
router.get('/recommendations', authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id; 
  
      const recommendations = await getRecommendationsBasedOnPrediction(userId);
      res.json(recommendations);
    } catch (error) {
      console.error('Error in recommendController:', error);
      res.status(500).json({ error: error.message });
    }
  });
  

  router.post('/recommendations', authenticateJWT, async (req, res) => {
    try {
      const { craftId } = req.body; 
      const userId = req.user.id; 
  
      if (!craftId) {
        return res.status(400).json({ error: 'craftId is required' });
      }
  
      await saveUserRecommendation(userId, craftId);
      res.status(201).json({ message: 'Recommendation saved successfully' });
    } catch (error) {
      console.error('Error in recommendController (POST):', error);
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
