const { PrismaClient } = require('@prisma/client');
const axios = require("axios");
const { Storage } = require('@google-cloud/storage');
const prisma = new PrismaClient();
const { getRecommendationsBasedOnPrediction } = require("../recommend/recommendService"); 


// Google Cloud Storage setup
const storage = new Storage({ keyFilename: process.env.GOOGLE_CLOUD_KEY_PATH });
const bucket = storage.bucket('upload-waste'); 

// Function to handle file upload logic
const handleFileUpload = async (file, userId, body) => {
  if (!file) throw new Error("File tidak diberikan");

  try {
    // Creating a unique file name
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
    const fileExtension = file.mimetype.split("/")[1];
    const uniqueFileName = `${uniqueSuffix}.${fileExtension}`;

    // Upload the file to Google Cloud Storage
    const fileGCS = bucket.file(uniqueFileName);
    const blobStream = fileGCS.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileGCS.name}`;

        // Save file URL to database
        const uploadedFile = await prisma.upload.create({
          data: {
            userId,
            image_name: uniqueFileName,
            image_url: publicUrl,
            type: file.mimetype,
            size: file.size,
            description: body.description || null,
          },
        });

        resolve({ uploadedFile, publicUrl });
      });

      blobStream.on('error', (error) => {
        reject(new Error("GCS Upload Error: " + error));
      });

      blobStream.end(file.buffer);
    });
  } catch (error) {
    console.error("Error saving file to database:", error);
    throw new Error("Gagal menyimpan file ke database: " + error.message);
  }
};

// Function to send the image URL to Flask API and get prediction
const getPredictionFromAPI = async (publicUrl) => {
  try {
    const mlResponse = await axios.post('https://flask-api-2-397394536573.asia-southeast2.run.app/predict', { image_url: publicUrl });

    if (!mlResponse || !mlResponse.data || !mlResponse.data.prediction) {
      throw new Error("Gagal menerima hasil prediksi dari API Flask.");
    }

    const { prediction, confidence } = mlResponse.data;
    return { prediction, confidence };
  } catch (error) {
    console.error("Error sending URL to Flask API:", error);
    throw new Error("Gagal mengirim URL gambar ke API Flask untuk analisis prediksi.");
  }
};

// Function to save prediction to the database
const savePredictionToDatabase = async (fileRecord, prediction, confidence, userId) => {
  try {
    await prisma.prediction.create({
      data: {
        uploadId: fileRecord.id,
        prediction: prediction,
        confidence: confidence,
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Error saving prediction to database:", error);
    throw new Error("Gagal menyimpan prediksi ke database.");
  }
};

// Function to get recommendations based on prediction
const getRecommendations = async (userId) => {
  // Call your existing recommendation logic here
  return await getRecommendationsBasedOnPrediction(userId);
};

module.exports = { handleFileUpload, getPredictionFromAPI, savePredictionToDatabase, getRecommendations };
