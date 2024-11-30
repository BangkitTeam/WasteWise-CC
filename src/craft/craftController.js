const { Router } = require("express");
const { addCraft, getCrafts, deleteCraft } = require("./craftService");
const { validateRequest } = require("../middlewares/validationMiddleware");
const { createCraftSchema } = require("./craftValidations");

const router = Router();

// Route untuk menambah Craft
router.post(
  "/addcrafts",
  validateRequest(createCraftSchema), // Validasi input untuk pembuatan craft
  async (req, res) => {
    const { title, description } = req.body;

    try {
      const addedCraft = await addCraft(title, description);
      res.status(201).json({ message: "Craft added successfully", addedCraft });
    } catch (error) {
      res.status(400).json({ error: error.message });
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

// Delete craft ini perlu atau tidak ya ?
router.delete("/crafts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await deleteCraft(Number(id));
    // Menambahkan ID craft dalam pesan sukses
    res
      .status(200)
      .json({ message: `Craft ID ${id} deleted successfully`, response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

