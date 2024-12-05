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

  validateRequest(createCraftSchema), // Assuming you want to validate the schema
  async (req, res) => {
    let crafts = req.body;

    // If crafts is not an array, convert it into one
    if (!Array.isArray(crafts)) {
      crafts = [crafts]; // Convert single object to an array
    }

    try {
      const addedCrafts = await addCraft(crafts); // This now handles both single and array input
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
