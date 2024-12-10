const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk mendapatkan prediksi terakhir berdasarkan userId
const getLatestPrediction = async (userId) => {
  try {
    const prediction = await prisma.prediction.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        prediction: true,
        confidence: true,
      },
    });

    if (!prediction) {
      console.error(`No prediction found for userId: ${userId}`);
      throw new Error('No predictions found for this user.');
    }

    return prediction;
  } catch (error) {
    console.error('Error fetching the latest prediction:', error);
    throw new Error('Failed to fetch the latest prediction.');
  }
};

// Fungsi untuk mendapatkan rekomendasi craft berdasarkan wasteType
const getCraftRecommendations = async (wasteType) => {
  try {
    const recommendations = await prisma.craft.findMany({
      where: {
        wasteType: wasteType,
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        tutorialUrl: true,
      },
    });

    if (recommendations.length === 0) {
      console.error(`No recommendations found for wasteType: ${wasteType}`);
      throw new Error('No recommendations found for this waste type.');
    }

    return recommendations;
  } catch (error) {
    console.error('Error fetching craft recommendations:', error);
    throw new Error('Failed to fetch recommendations.');
  }
};

// Fungsi untuk mendapatkan gambar upload pengguna berdasarkan userId
const getUserImage = async (userId) => {
  try {
    const upload = await prisma.upload.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc', // Pastikan mengambil gambar yang terbaru
      },
      select: {
        image_url: true,
      },
    });

    if (!upload) {
      console.error(`No image upload found for userId: ${userId}`);
      throw new Error('No upload found for this user.');
    }

    console.log('User Image URL:', upload.image_url);  // Log gambar terbaru yang diambil
    return upload.image_url;
  } catch (error) {
    console.error('Error fetching user image:', error);
    throw new Error('Failed to fetch user image.');
  }
};

// Fungsi utama untuk mendapatkan rekomendasi berdasarkan prediksi terakhir
const getRecommendationsBasedOnPrediction = async (userId) => {
  try {
    // Mengambil prediksi terakhir
    const prediction = await getLatestPrediction(userId);
    console.log('Prediction:', prediction); // Log hasil prediksi

    // Mendapatkan rekomendasi berdasarkan prediksi
    const recommendations = await getCraftRecommendations(prediction.prediction);
    console.log('Recommendations:', recommendations); // Log rekomendasi craft

    // Mendapatkan URL gambar user
    const userImageUrl = await getUserImage(userId);
    console.log('User Image URL:', userImageUrl); // Log URL gambar pengguna

    // Menyimpan rekomendasi pengguna
    const craftIds = recommendations.map(rec => rec.id);
    const savedRecommendationIds = await saveUserRecommendation(userId, craftIds);

    console.log('Saved Recommendations IDs:', savedRecommendationIds); // Log ID rekomendasi yang disimpan

    // Mengembalikan response dalam format yang rapi tanpa "result"
    return {
      user_id: userId,
      image_url: userImageUrl,
      confidence: prediction.confidence,
      prediction: prediction.prediction,
      userrecommendation_ids: savedRecommendationIds, // Menambahkan ID rekomendasi yang disimpan
      recommendations: recommendations.map((rec) => ({
        id: rec.id,
        title: rec.title,
        description: rec.description,
        imageUrl: rec.imageUrl,
        tutorialUrl: rec.tutorialUrl,
      })),
    };
  } catch (error) {
    console.error('Error getting recommendations based on prediction:', error.message);
    throw new Error('Failed to get recommendations.');
  }
};

// Fungsi untuk menyimpan rekomendasi pengguna ke dalam tabel UserRecommendation
const saveUserRecommendation = async (userId, craftIds) => {
  try {
    const savedRecommendationIds = [];

    for (const craftId of craftIds) {
      const savedRecommendation = await prisma.userrecommendation.create({
        data: {
          userId: userId,
          craftId: craftId,
        },
      });
      savedRecommendationIds.push(savedRecommendation.id);
    }

    console.log(`${savedRecommendationIds.length} recommendations saved for userId: ${userId}`);
    return savedRecommendationIds; 
  } catch (error) {
    console.error('Error saving user recommendations:', error);
    throw new Error('Failed to save user recommendations.');
  }
};


module.exports = {
  getRecommendationsBasedOnPrediction,
  saveUserRecommendation,
};
