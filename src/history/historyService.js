const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fungsi untuk mengambil riwayat rekomendasi berdasarkan userId
const getUserRecommendationHistory = async (userId) => {
  try {
    // Mengambil semua rekomendasi yang terkait dengan userId
    const recommendations = await prisma.userrecommendation.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }, // Mengurutkan berdasarkan tanggal pembuatan rekomendasi
      include: {
        craft: {
          select: {
            title: true,
            description: true,
            imageUrl: true,
            tutorialUrl: true,
          },
        },
      },
    });

    // Menghindari duplikasi craftId
    const processedCrafts = new Set();
    const filteredRecommendations = [];

    for (const recommendation of recommendations) {
      const craft = recommendation.craft; // Mengakses craft yang terkait dengan rekomendasi
      if (!processedCrafts.has(recommendation.craftId)) {
        filteredRecommendations.push({
          id: recommendation.id,
          title: craft.title,
          description: craft.description,
          imageUrl: craft.imageUrl,
          tutorialUrl: craft.tutorialUrl,
        });
        processedCrafts.add(recommendation.craftId); // Menandai craftId untuk menghindari duplikasi
      }
    }

    console.log("Recommendation history fetched successfully.");
    return filteredRecommendations;
  } catch (error) {
    console.error("Error fetching user recommendation history:", error);
    throw new Error("Failed to fetch recommendation history.");
  }
};

const deleteRecommendationById = async (id, userId) => {
  try {
    console.log(`Searching for recommendation in Userrecommendation with id: ${id} and userId: ${userId}`); 

    // Mencari rekomendasi berdasarkan id dan userId di tabel Userrecommendation
    const recommendation = await prisma.userrecommendation.findFirst({
      where: {
        id: id,           // Pastikan id cocok
        userId: userId,   // Pastikan userId sesuai
      },
    });

    if (!recommendation) {
      console.log(`No recommendation found with id: ${id} for userId: ${userId}`);
      return null; // If no recommendation is found
    }

    console.log(`Found recommendation with id: ${id} for userId: ${userId}. Deleting...`);

    try {
      // Try to delete the recommendation from userrecommendation
      await prisma.userrecommendation.delete({
        where: { id: id },
      });

      console.log(`Recommendation with id: ${id} deleted successfully.`);
      return { message: "Recommendation deleted successfully." };
    } catch (error) {
      if (error.code === 'P2003') {  // Foreign key constraint error
        console.log(`Foreign key constraint error: recommendation with id ${id} is still in favorites.`);
        return { message: "Recommendation is still in favorites. Please remove it from favorites first." };
      }
      console.error(`Error in deleteRecommendationById: ${error.message}`);
      throw new Error("Failed to delete recommendation: " + error.message);
    }
  } catch (error) {
    console.error(`Error during delete operation: ${error.message}`);
    throw new Error("Failed to delete recommendation: " + error.message);
  }
};

module.exports = {
  getUserRecommendationHistory,
  deleteRecommendationById,
};
