const { Router } = require("express");
const {
  addCraft,
  getCrafts,
  deleteCraft,
  updateCraft,
} = require("./craftService");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { createCraftSchema } = require("./craftValidation");

const router = Router();

router.post(
  "/addcrafts",
  validateRequest(createCraftSchema),
  async (req, res) => {
    const crafts = req.body;

    try {
      const addedCrafts = await addCraft(crafts);
      res.status(201).json({
        message: "Crafts added successfully",
        addedCrafts: addedCrafts,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Dapatkan Semua Craft
router.get("/crafts", async (req, res, next) => {
  try {
    const crafts = await getCrafts();
    res.status(200).json(crafts);
  } catch (error) {
    next(error);
  }
});

router.delete("/crafts/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const response = await deleteCraft(Number(id));
    res.status(200).json({
      message: `Craft ID ${id} deleted successfully`,
      response,
    });
  } catch (error) {
    next(error);
  }
});

// Update Craft
router.put(
  "/crafts/:id",
  validateRequest(createCraftSchema),
  async (req, res) => {
    const { id } = req.params;
    const craft = req.body;

    try {
      const updatedCraft = await updateCraft(id, craft);
      res
        .status(200)
        .json({ message: "Craft updated successfully", updatedCraft });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;

/*
const { Router } = require("express");
const multer = require("multer");
const { addCraft, getCrafts, deleteCraft } = require("./craftService");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { createCraftSchema } = require("./craftValidations");
const { Storage } = require("@google-cloud/storage");
const dotenv = require("dotenv");

dotenv.config();

const router = Router();

// Konfigurasi Google Cloud Storage
const storage = new Storage({ keyFilename: process.env.GOOGLE_CLOUD_KEY_PATH });
const bucket = storage.bucket('upload-craft'); // Nama bucket di GCS

// Konfigurasi multer untuk penyimpanan sementara (MemoryStorage)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."));
    }
  },
});

// Route untuk menambah Craft (Google Cloud Storage)
router.post(
  "/addcrafts",
  upload.single("imageUrl"),
  validateRequest(createCraftSchema),
  async (req, res) => {
    const { title, description, wasteType, tutorialUrl } = req.body; // Menangkap tutorialUrl

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }

    try {
      // Buat nama file unik
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = req.file.mimetype.split("/")[1];
      const fileName = `${uniqueSuffix}.${fileExtension}`;
      const file = bucket.file(fileName);

      // Upload file ke GCS
      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      stream.on("error", (err) => {
        console.error("GCS Upload Error:", err);
        return res
          .status(500)
          .json({ error: "Failed to upload file to Google Cloud Storage." });
      });

      stream.on("finish", async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        // Simpan data ke database dengan URL dari GCS
        const addedCraft = await addCraft(
          title,
          description,
          wasteType,
          publicUrl, // URL dari Google Cloud Storage
          tutorialUrl // Menambahkan tutorialUrl
        );

        res.status(201).json({
          message: "Craft added successfully (GCS)",
          addedCraft,
        });
      });

      stream.end(req.file.buffer);
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server." });
    }
  }
);

// Route untuk mendapatkan semua Craft
router.get("/crafts", async (req, res) => {
  try {
    const crafts = await getCrafts();
    res.status(200).json(crafts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route untuk menghapus Craft
router.delete("/crafts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await deleteCraft(Number(id));
    res
      .status(200)
      .json({ message: `Craft ID ${id} deleted successfully`, response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
*/
