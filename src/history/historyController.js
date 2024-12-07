const { Router } = require("express");
const {
  getUserHistory,
  deleteUserHistoryById,
  deleteAllUserHistory,
} = require("./historyService");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const router = Router();

// Get user history by user ID
router.get("/user", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const history = await getUserHistory(userId);  // Call the service to fetch user history

    if (!history || history.length === 0) {
      return res.status(404).json({
        message: "No history found for the user.",
      });
    }

    // Return the response in the desired format
    return res.status(200).json({
      message: "Recommendation history fetched successfully.",
      data: history,  // The data here is already formatted by the service
    });
  } catch (error) {
    console.error(`Error fetching user history: ${error.message}`);
    return res.status(500).json({
      error: "An error occurred while fetching user history.",
      details: error.message,
    });
  }
});

// Delete specific history entry by ID
router.delete("/histories/:id", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const historyId = req.params.id;

    if (!historyId) {
      return res.status(400).json({ error: "History ID is required" });
    }

    const result = await deleteUserHistoryById(userId, historyId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error deleting history entry: ${error.message}`);
    return res.status(500).json({
      error: "An error occurred while deleting the history entry.",
      details: error.message,
    });
  }
});

// Delete all user history
router.delete("/user", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const result = await deleteAllUserHistory(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error deleting all user history: ${error.message}`);
    return res.status(500).json({
      error: "An error occurred while deleting user history.",
      details: error.message,
    });
  }
});

module.exports = router;
