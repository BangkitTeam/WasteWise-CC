// Upload lokal
/*
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleFileUpload = async (file, userId, body) => {
  if (!file) throw new Error("File tidak diberikan");

  try {
    const uploadedFile = await prisma.upload.create({
      data: {
        userId,
        filename: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size,
        description: body.description || null, 
      },
    });

    return uploadedFile;
  } catch (error) {
    console.error("Error saving file to database: ", error.message);
    throw new Error("Gagal menyimpan file ke database: " + error.message);
  }
};
*/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk menyimpan URL file ke database
const handleFileUpload = async (file, userId, body) => {
  if (!file) throw new Error("File tidak diberikan");

  try {
    // Membuat nama file unik
    const uniqueSuffix = Date.now()+ Math.round(Math.random() * 1E9);
    const fileExtension = file.mimetype.split("/")[1];
    const uniqueFileName = `${uniqueSuffix}`;

    // Simpan data file ke database
    const uploadedFile = await prisma.upload.create({
      data: {
        userId,
        image_name: uniqueFileName, 
        image_url: file.path,
        type: file.mimetype, 
        size: file.size,
        description: body.description || null, 
      },
    });    

    return uploadedFile;
  } catch (error) {
    console.error("Error saving file to database: ", error.message);
    throw new Error("Gagal menyimpan file ke database: " + error.message);
  }
};

module.exports = { handleFileUpload };
