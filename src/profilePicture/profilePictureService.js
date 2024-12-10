const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');

// File filter to validate file type
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Provide explicit error for unsupported formats
    cb(new Error('Only JPEG and PNG images are allowed.'));
  }
};

// File size limit (5 MB)
const MAX_FILE_SIZE = 3 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// Google Cloud Storage setup
const storage = new Storage({
  projectId: 'bangkit-capstone-441807',
  keyFilename: path.join(__dirname, '../../sv-key.json'),
});

const bucketName = 'profile-picture-cb';
const bucket = storage.bucket(bucketName);

// Upload file to Google Cloud Storage
const uploadFileToCloud = async (file, userId) => {
  try {
    const fileExtension = file.mimetype === 'image/jpeg' ? '.jpg' : '.png';
    const randomFileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}${fileExtension}`;
    const destination = `${userId}/${randomFileName}`;

    const stream = bucket.file(destination).createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Stream file to Cloud Storage
    stream.end(file.buffer);

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
        resolve(publicUrl);
      });

      stream.on('error', (error) => {
        console.error('Error uploading file to Google Cloud Storage:', error);
        reject(new Error('Failed to upload file to Google Cloud Storage.'));
      });
    });
  } catch (error) {
    console.error('Error uploading file to Google Cloud Storage:', error);
    throw new Error('Failed to upload file to Google Cloud Storage.');
  }
};

// Update user's profile picture URL in the database
const updateUserProfilePicture = async (userId, profilePictureUrl) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: profilePictureUrl },
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile picture:', error);
    throw new Error('Failed to update user profile picture.');
  }
};

// Handle profile picture upload and database update
const handleProfilePictureUpload = async (userId, file) => {
  if (!file) {
    throw new Error('No file uploaded.');
  }

  try {
    // Upload file to Google Cloud Storage and get the URL
    const profilePictureUrl = await uploadFileToCloud(file, userId);
    // Update the user's profile picture in the database
    await updateUserProfilePicture(userId, profilePictureUrl);
    return profilePictureUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error('Failed to upload profile picture.');
  }
};

// Fetch the user's profile picture URL from the database
const getUserProfilePicture = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, profilePicture: true },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    return { userId: user.id, profilePicture: user.profilePicture };
  } catch (error) {
    console.error('Error fetching user profile picture:', error);
    throw new Error('Failed to fetch user profile picture.');
  }
};

module.exports = { handleProfilePictureUpload, getUserProfilePicture, upload };
