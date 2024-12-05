const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fungsi untuk memeriksa apakah riwayat rekomendasi sudah ada
const isRecommendationHistoryExist = async (userId, recommendationId) => {
  try {
    const existingHistory = await prisma.history.findFirst({
      where: {
        userId: userId,
        userRecommendationId: recommendationId,
      },
    });

    return existingHistory ? true : false; 
  } catch (error) {
    console.error("Error checking recommendation history existence:", error);
    throw new Error("Failed to check history existence.");
  }
};

// Fungsi untuk menyimpan riwayat rekomendasi ke tabel History
const saveRecommendationHistory = async (userId, craftId) => {
  try {
    const historyExists = await isRecommendationHistoryExist(userId, craftId);

    if (historyExists) {
      console.log(
        "Recommendation history already exists for this user and craft."
      );
      return; 
    }

    await prisma.history.create({
      data: {
        userId: userId,
        userRecommendationId: craftId,
      },
    });

    console.log("Recommendation history saved successfully.");
  } catch (error) {
    console.error("Error saving recommendation history:", error);
    throw new Error("Failed to save recommendation history.");
  }
};

// Fungsi untuk mengambil riwayat rekomendasi berdasarkan userId
const getUserRecommendationHistory = async (userId) => {
  try {
    const recommendations = await prisma.userrecommendation.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        craft: {
          select: {
            title: true,
            description: true,
            imageUrl: true,
          },
        },
      },
    });

    const processedCrafts = new Set();
    const filteredRecommendations = [];

    for (const recommendation of recommendations) {
      if (!processedCrafts.has(recommendation.craftId)) {
        await saveRecommendationHistory(userId, recommendation.craftId); 
        processedCrafts.add(recommendation.craftId); 
        filteredRecommendations.push({
          id: recommendation.id,
          title: recommendation.craft.title,
          description: recommendation.craft.description,
          imageUrl: recommendation.craft.imageUrl,
        });
      }
    }
    console.log("Recommendation history fetched successfully.");
    return filteredRecommendations;
  } catch (error) {
    console.error("Error fetching user recommendation history:", error);
    throw new Error("Failed to fetch recommendation history.");
  }
};

const deleteHistoryById = async (id, userId) => {
  try {
    const history = await prisma.history.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!history) {
      return null; 
    }

    await prisma.history.delete({ where: { id: id } });
    return { message: "History deleted successfully." };
  } catch (error) {
    console.error('Error deleting history:', error);
    throw new Error('Failed to delete history.');
  }
};

const deleteAllHistoryByUserId = async (userId, requesterId) => {
  if (userId !== requesterId) {
    throw new Error("Unauthorized to delete history of another user.");
  }

  try {
    await prisma.history.deleteMany({
      where: {
        userId: userId,
      },
    });
    console.log("All history for user deleted successfully.");
    return { message: "All history for user deleted successfully." };
  } catch (error) {
    console.error("Error deleting all history:", error);
    throw new Error("Failed to delete all history.");
  }
};

module.exports = {
  getUserRecommendationHistory,
  saveRecommendationHistory,
  deleteHistoryById,
  deleteAllHistoryByUserId
};
