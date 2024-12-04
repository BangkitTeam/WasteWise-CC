const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
      throw new Error('No predictions found for this user.');
    }

    return prediction;
  } catch (error) {
    console.error('Error fetching the latest prediction:', error);
    throw new Error('Failed to fetch the latest prediction.');
  }
};

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
      },
    });

    if (recommendations.length === 0) {
      throw new Error('No recommendations found for this waste type.');
    }

    return recommendations;
  } catch (error) {
    console.error('Error fetching craft recommendations:', error);
    throw new Error('Failed to fetch recommendations.');
  }
};

const getUserImage = async (userId) => {
  try {
    const upload = await prisma.upload.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc', 
      },
      select: {
        image_url: true,
      },
    });

    if (!upload) {
      throw new Error('No upload found for this user.');
    }

    console.log('User Image URL:', upload.image_url); 
    return upload.image_url;
  } catch (error) {
    console.error('Error fetching user image:', error);
    throw new Error('Failed to fetch user image.');
  }
};


const getRecommendationsBasedOnPrediction = async (userId) => {
  try {
    const prediction = await getLatestPrediction(userId);
    console.log('Prediction:', prediction);


    const recommendations = await getCraftRecommendations(prediction.prediction);
    console.log('Recommendations:', recommendations); 

    // Mendapatkan URL gambar user
    const userImageUrl = await getUserImage(userId);
    console.log('User Image URL:', userImageUrl); 


    const craftIds = recommendations.map(rec => rec.id);
    await saveUserRecommendation(userId, craftIds);

    return {
      user_id: userId,
      image_url: userImageUrl,
      confidence: prediction.confidence,
      prediction: prediction.prediction,
      recommendations: recommendations.map((rec) => ({
        title: rec.title,
        description: rec.description,
        imageUrl: rec.imageUrl,
      })),
    };
  } catch (error) {
    console.error('Error getting recommendations based on prediction:', error);
    throw new Error('Failed to get recommendations.');
  }
};

const saveUserRecommendation = async (userId, craftIds) => {
  try {
    const userRecommendations = craftIds.map(craftId => ({
      userId: userId,
      craftId: craftId,
    }));

    const result = await prisma.userrecommendation.createMany({
      data: userRecommendations,
      skipDuplicates: true, 
    });

    console.log(`${result.count} recommendations saved for userId: ${userId}`);
  } catch (error) {
    console.error('Error saving user recommendations:', error);
    throw new Error('Failed to save user recommendations.');
  }
};

module.exports = {
  getRecommendationsBasedOnPrediction,
  saveUserRecommendation,
};
