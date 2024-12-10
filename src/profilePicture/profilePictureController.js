const { handleProfilePictureUpload, getUserProfilePicture, upload } = require('./profilePictureService');
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { Router } = require('express');

const router = Router();

router.post(
  '/', 
  authenticateJWT, 
  (req, res) => {
    // Menangani upload file langsung di sini
    upload.single('profilePicture')(req, res, async (err) => {
      if (err) {
        // Jika error adalah tipe MIME yang tidak sesuai, kirim respons 415
        if (err.message === 'Only JPEG and PNG images are allowed.') {
          return res.status(415).json({
            message: 'Hanya gambar JPEG dan PNG yang diperbolehkan.',
          });
        }

        // Jika ada error lain (seperti ukuran file terlalu besar)
        return res.status(400).json({
          message: 'Gagal mengunggah file.',
          error: err.message,
        });
      }

      const userId = req.user.id;
      const file = req.file;

      // Jika tidak ada file yang diunggah
      if (!file) {
        return res.status(400).json({
          message: 'Tidak ada file yang diunggah.',
        });
      }

      try {
        // Menangani upload foto profil dan update profil pengguna
        const profilePictureUrl = await handleProfilePictureUpload(userId, file);

        // Respons berhasil
        return res.status(200).json({
          message: 'Foto profil berhasil diunggah dan diperbarui.',
          data: {
            userId: userId,
            profilePicture: profilePictureUrl,
          },
        });
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).json({
          message: 'Gagal mengunggah foto profil.',
          error: error.message,
        });
      }
    });
  }
);

router.get('/', authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    // Mengambil data foto profil pengguna
    const userProfile = await getUserProfilePicture(userId);

    // Respons berhasil
    return res.status(200).json({
      message: 'Foto profil dan ID pengguna berhasil diambil.',
      data: {
        userId: userProfile.userId,
        profilePicture: userProfile.profilePicture,
      },
    });
  } catch (error) {
    console.error('Error fetching profile picture and user ID:', error);
    return res.status(500).json({ 
      message: 'Gagal mengambil foto profil pengguna.',
      error: error.message,
    });
  }
});

module.exports = router;
