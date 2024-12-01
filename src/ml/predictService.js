const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk mendapatkan prediksi terakhir berdasarkan ID terbaru
const getLatestPrediction = async () => {
  try {
    const latestPrediction = await prisma.prediction.findFirst({
      orderBy: {
        createdAt: 'desc', 
      },
    });

    if (latestPrediction) {
      return latestPrediction;
    } else {
      throw new Error("No prediction found");
    }
  } catch (error) {
    console.error("Error fetching latest prediction:", error);
    throw new Error("Failed to retrieve latest prediction");
  }
};

module.exports = {
  getLatestPrediction,
};
