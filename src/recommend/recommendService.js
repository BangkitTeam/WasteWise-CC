// CSV
/*
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const prisma = new PrismaClient();

// Function to get the latest prediction from the database
const getLatestPrediction = async () => {
    try {
      const prediction = await prisma.prediction.findFirst({
        orderBy: {
          createdAt: 'desc', // Sort by createdAt to get the most recent prediction
        },
        select: {
          prediction: true,
          confidence: true,
          uploadId: true,
        },
      });
  
      if (!prediction) {
        throw new Error('No predictions found.');
      }
  
      return prediction;
    } catch (error) {
      console.error('Error fetching the latest prediction:', error);
      throw new Error('Failed to fetch the latest prediction.');
    }
  };
  

// Function to read CSV file and return recommendations based on waste_type
const getCraftIdeas = (wasteType) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'waste.csv')) // Path updated to current directory
      .pipe(csv({ separator: ';' })) // Use ';' as the delimiter
      .on('data', (data) => {
        if (data.waste_type.toLowerCase() === wasteType.toLowerCase()) {
          results.push({
            title: data.title,
            description: data.description,
          });
        }
      })
      .on('end', () => {
        if (results.length > 0) {
          resolve(results);
        } else {
          reject(new Error('No craft ideas found for this waste type.'));
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = {
  getLatestPrediction,
  getCraftIdeas,
};
*/

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
      throw new Error('No predictions found for this user.');
    }

    return prediction;
  } catch (error) {
    console.error('Error fetching the latest prediction:', error);
    throw new Error('Failed to fetch the latest prediction.');
  }
};

// Fungsi untuk mendapatkan rekomendasi craft berdasarkan waste_type
const getCraftRecommendations = async (wasteType) => {
  try {
    const recommendations = await prisma.craft.findMany({
      where: {
        wasteType: wasteType,
      },
      select: {
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

// Fungsi untuk mendapatkan gambar upload pengguna berdasarkan userId
const getUserImage = async (userId) => {
  try {
    const upload = await prisma.upload.findFirst({
      where: {
        userId: userId,
      },
      select: {
        image_url: true, 
      },
    });

    if (!upload) {
      throw new Error('No upload found for this user.');
    }

    return upload.image_url; 
  } catch (error) {
    console.error('Error fetching user image:', error);
    throw new Error('Failed to fetch user image.');
  }
};

// Fungsi utama untuk mendapatkan rekomendasi berdasarkan prediksi terakhir
const getRecommendationsBasedOnPrediction = async (userId) => {
  try {
    const prediction = await getLatestPrediction(userId);
    
    const recommendations = await getCraftRecommendations(prediction.prediction);

    const userImageUrl = await getUserImage(userId);

    return {
      userId: userId,
      prediction_confidence: prediction.confidence,
      image_url: userImageUrl,
      recommendations: recommendations,
    };
  } catch (error) {
    console.error('Error getting recommendations based on prediction:', error);
    throw new Error('Failed to get recommendations.');
  }
};

// Fungsi untuk menyimpan rekomendasi pengguna ke dalam tabel UserRecommendation
const saveUserRecommendation = async (userId, craftId) => {
  try {
    await prisma.userRecommendation.create({
      data: {
        userId: userId,
        craftId: craftId,
      },
    });
    console.log('User recommendation saved');
  } catch (error) {
    console.error('Error saving user recommendation:', error);
    throw new Error('Failed to save user recommendation.');
  }
};

module.exports = {
  getRecommendationsBasedOnPrediction,
  saveUserRecommendation,
};
