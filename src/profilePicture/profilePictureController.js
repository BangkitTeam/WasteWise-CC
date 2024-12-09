const {
  handleProfilePictureUpload,
  getProfilePicture,
} = require("./profilePictureService");
const multer = require("multer");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { Router } = require("express");

// Konfigurasi multer untuk menggunakan memoryStorage
const upload = multer({ storage: multer.memoryStorage() }); // Menyimpan file dalam memory (buffer)

const router = Router();

router.post(
  "/",
  authenticateJWT,
  upload.single("profilePicture"),
  async (req, res) => {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      // Memanggil service untuk mengunggah file dan memperbarui foto profil
      const profilePictureUrl = await handleProfilePictureUpload(userId, file);

      // Mengirimkan respons sukses dengan URL foto profil yang baru
      res.status(200).json({
        message: "Profile picture uploaded and updated successfully.",
        profilePictureUrl: profilePictureUrl,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/", authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    // Memanggil service untuk mendapatkan URL foto profil
    const profilePictureUrl = await getProfilePicture(userId);

    if (!profilePictureUrl) {
      return res.status(404).json({ message: "Profile picture not found." });
    }

    // Mengirimkan respons dengan URL foto profil
    res.status(200).json({
      message: "Profile picture retrieved successfully.",
      profilePictureUrl: profilePictureUrl,
    });
  } catch (error) {
    console.error("Error retrieving profile picture:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
