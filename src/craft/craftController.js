const { Router } = require("express");
const { addCraft, getCrafts, deleteCraft, updateCraft, } = require("./craftService");
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
        res.status(200).json({ message: "Craft updated successfully", updatedCraft });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );
  
module.exports = router;
