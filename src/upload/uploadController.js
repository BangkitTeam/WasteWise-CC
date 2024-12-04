const { Router } = require("express");
const multer = require("multer");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { uploadSchema } = require("./uploadValidation");
const { handleFileUpload, getPredictionFromAPI, savePredictionToDatabase, getRecommendations } = require("./uploadService");

const multerStorage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("file");

const router = Router();

router.post(
  "/upload",
  authenticateJWT,
  validateRequest(uploadSchema),
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            error: "Ukuran file terlalu besar! Maksimal ukuran file adalah 10MB.",
          });
        }

        if (err.message === "File type not allowed") {
          return res.status(415).json({
            error: "File tidak valid! Hanya file JPG, PNG, atau JPEG yang diperbolehkan.",
          });
        }

        console.error("Multer Error:", err);
        return res.status(500).json({
          error: "Terjadi kesalahan pada server. Silakan coba lagi.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: "Tidak ada file yang diupload!",
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      const { originalname, buffer, mimetype } = req.file;

      // Handle file upload logic in service
      const { uploadedFile, publicUrl } = await handleFileUpload({ originalname, buffer, mimetype, size: req.file.size }, req.user.id, req.body);

      // Get prediction from Flask API
      const { prediction, confidence } = await getPredictionFromAPI(publicUrl);

      // Save prediction to database
      await savePredictionToDatabase(uploadedFile, prediction, confidence, req.user.id);

      // Get recommendations based on prediction
      const recommendations = await getRecommendations(req.user.id);

      res.status(201).json({
        message: "File uploaded successfully, prediction processed, and recommendations fetched.",
        data: recommendations,
      });
    } catch (error) {
      console.error("Server Error:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
