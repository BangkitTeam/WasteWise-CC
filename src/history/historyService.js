const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getUserHistory = async (userId) => {
  try {
    const history = await prisma.userHistory.findMany({
      where: { userId },
      include: { craft: true },
    });

    if (!history || history.length === 0) {
      throw new Error("No history found for the user.");
    }

    // Format history data to match the required response structure
    const formattedHistory = history.map((entry) => ({
      id: entry.craft.id,
      title: entry.craft.title,
      description: entry.craft.description,
      imageUrl: entry.craft.imageUrl,
    }));

    return formattedHistory; // Return the formatted history array
  } catch (error) {
    console.error("Error fetching history:", error);
    throw new Error(`Error fetching history: ${error.message}`);
  }
};

// Function to delete a specific history entry by ID
const deleteUserHistoryById = async (userId, historyId) => {
  try {
    const history = await prisma.userHistory.findUnique({
      where: { id: parseInt(historyId) }, // Ensure the historyId is correctly parsed
      include: { craft: true }, // You can include craft data as it’s related
    });

    if (!history) {
      throw new Error("History entry not found.");
    }

    if (history.userId !== parseInt(userId)) {
      throw new Error("Unauthorized to delete this history entry.");
    }

    // Delete the userHistory entry
    await prisma.userHistory.delete({
      where: { id: parseInt(historyId) },
    });

    return { message: "History entry deleted successfully." };
  } catch (error) {
    throw new Error(`Error deleting history entry: ${error.message}`);
  }
};

// Function to delete all history for a specific user
const deleteAllUserHistory = async (userId) => {
  try {
    // Delete all history entries for the user
    await prisma.userHistory.deleteMany({
      where: { userId: parseInt(userId) },
    });

    return { message: "All history for the user has been deleted." };
  } catch (error) {
    throw new Error(`Error deleting all history: ${error.message}`);
  }
};

module.exports = {
  getUserHistory,
  deleteUserHistoryById,
  deleteAllUserHistory,
};
