const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Inisialisasi Google Cloud Storage
const storage = new Storage({
  projectId: "bangkit-capstone-441807",
  keyFilename: path.join(__dirname, "../../sv-key.json"), // Ganti dengan path file service account
});

// Nama bucket di Google Cloud Storage
const bucketName = "profile-picture-cb"; // Ganti dengan nama bucket Anda
const bucket = storage.bucket(bucketName);

// Fungsi untuk mengunggah file ke Cloud Storage
const uploadFileToCloud = async (file, userId) => {
  try {
    // Membuat nama file acak menggunakan Date.now()
    const randomFileName = `${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}.jpg`;

    // Tentukan destinasi file berdasarkan userId dan nama file acak
    const destination = `${userId}/${randomFileName}`;

    // Upload file langsung ke Cloud Storage menggunakan buffer jika menggunakan multer dengan memoryStorage
    const stream = bucket.file(destination).createWriteStream({
      metadata: {
        contentType: file.mimetype, // Set content type sesuai dengan file yang diupload
      },
    });

    // Pipe file ke stream Cloud Storage
    stream.end(file.buffer);

    // Tunggu hingga proses upload selesai
    return new Promise((resolve, reject) => {
      stream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
        resolve(publicUrl);
      });

      stream.on("error", (error) => {
        console.error("Error uploading file to Google Cloud Storage:", error);
        reject(new Error("Failed to upload file to Google Cloud Storage."));
      });
    });
  } catch (error) {
    console.error("Error uploading file to Google Cloud Storage:", error);
    throw new Error("Failed to upload file to Google Cloud Storage.");
  }
};

// Fungsi untuk memperbarui foto profil pengguna di database
const updateUserProfilePicture = async (userId, profilePictureUrl) => {
  try {
    console.log(
      `Updating profile picture for user ${userId} to ${profilePictureUrl}`
    );
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: profilePictureUrl },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile picture:", error);
    throw new Error("Failed to update user profile picture.");
  }
};

// Fungsi untuk menangani upload dan update foto profil
const handleProfilePictureUpload = async (userId, file) => {
  if (!file) {
    throw new Error("No file uploaded.");
  }

  try {
    // Mengunggah file ke Cloud Storage dan mendapatkan URL-nya
    const profilePictureUrl = await uploadFileToCloud(file, userId);

    // Memperbarui URL foto profil pengguna di database
    await updateUserProfilePicture(userId, profilePictureUrl);

    return profilePictureUrl;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw new Error("Failed to upload profile picture.");
  }
};

// Fungsi untuk mendapatkan foto profil pengguna dari database
const getProfilePicture = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePicture: true },
    });

    if (!user || !user.profilePicture) {
      return null; // Tidak ada foto profil
    }

    return user.profilePicture; // Kembalikan URL foto profil
  } catch (error) {
    console.error("Error retrieving user profile picture:", error);
    throw new Error("Failed to retrieve profile picture.");
  }
};

module.exports = { handleProfilePictureUpload, getProfilePicture };
