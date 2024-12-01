const express = require("express");
const router = express.Router();
const { getLatestPrediction } = require("./predictService");

// Endpoint untuk mengambil prediksi terakhir
router.get("/latest-prediction", async (req, res) => {
  try {
    const prediction = await getLatestPrediction();

    if (!prediction) {
      return res.status(404).json({ error: "No prediction found" });
    }

    const result = {
      id: prediction.id,
      uploadId: prediction.uploadId,
      prediction: prediction.prediction,
      confidence: prediction.confidence,
      userId: prediction.userId,  
    };

    return res.json(result); 
  } catch (error) {
    console.error("Error fetching latest prediction:", error.message);
    return res.status(500).json({ error: error.message || "Failed to retrieve latest prediction" });
  }
});

module.exports = router;
