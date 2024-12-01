// Jika upload di lokal
/*
const { Router } = require("express");
const multer = require("multer");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { uploadSchema } = require("./uploadValidation");
const { handleFileUpload } = require("./uploadService");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.mimetype.split("/")[1];
    cb(null, uniqueSuffix + '.' + fileExtension);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
}).single("file");

const router = Router();

router.post(
  "/upload",
  authenticateJWT,
  validateRequest(uploadSchema),
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        if (err.message === "File type not allowed") {
          return res.status(415).json({ error: "File tidak valid! Hanya file JPG, PNG, atau JPEG yang diperbolehkan." });
        }
        console.error("Multer Error:", err);
        return res.status(500).json({ error: "Terjadi kesalahan pada server. Silakan coba lagi." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Tidak ada file yang diupload!" });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      const response = await handleFileUpload(req.file, req.user.id, req.body);
      res.status(201).json(response);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server. Silakan coba lagi." });
    }
  }
);

*/

const { Router } = require("express");
const multer = require("multer");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { uploadSchema } = require("./uploadValidation");
const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');
const { handleFileUpload, getImageUrls } = require("./uploadService");

dotenv.config();

// Google Cloud Storage
const storage = new Storage({ keyFilename: process.env.GOOGLE_CLOUD_KEY_PATH });
const bucket = storage.bucket('upload-waste'); 

// Konfigurasi multer untuk menyimpan file sementara
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
    fileSize: 10 * 1024 * 1024, 
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

      // Membuat nama file unik
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = mimetype.split("/")[1];
      const fileName = uniqueSuffix + '.' + fileExtension;

      // Upload file ke Google Cloud Storage
      const file = bucket.file(fileName);
      const blobStream = file.createWriteStream({
        metadata: {
          contentType: mimetype,
        },
      });

      // Mengunggah file ke GCS
      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        // Simpan URL ke database atau lakukan proses lainnya
        const response = await handleFileUpload({ originalname, path: publicUrl, mimetype, size: req.file.size }, req.user.id, req.body);

        res.status(201).json({
          message: "File uploaded successfully!",
          file: response,
        });
      });

      blobStream.on('error', (error) => {
        console.error("GCS Upload Error:", error);
        res.status(500).json({ error: "Terjadi kesalahan saat menyimpan file di cloud." });
      });

      // Menulis file buffer ke Google Cloud Storage
      blobStream.end(buffer);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server. Silakan coba lagi." });
    }
  }
);



