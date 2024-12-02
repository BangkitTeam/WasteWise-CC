const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

// Service untuk menambah Craft
const addCraft = async (
  title,
  description,
  wasteType,
  imageUrl,
  tutorialUrl
) => {
  return await prisma.craft.create({
    data: {
      title,
      description,
      wasteType,
      imageUrl,
      tutorialUrl, 
    },
  });
};

// Service untuk mendapatkan semua Craft
const getCrafts = async () => {
  return await prisma.craft.findMany({
    include: {
      UserRecommendations: true, // Include relasi jika diperlukan
    },
  });
};

// Service untuk menghapus Craft
const deleteCraft = async (id) => {
  const craft = await prisma.craft.findUnique({ where: { id } });

  if (!craft) throw new Error("Craft not found");

  // Menghapus file gambar terkait (opsional)
  if (craft.imageUrl) {
    const imagePath = path.join(
      __dirname,
      "../craftImage",
      path.basename(craft.imageUrl)
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Hapus file gambar dari folder uploads
    }
  }

  await prisma.craft.delete({ where: { id } });

  return { message: "Craft deleted successfully" };
};

module.exports = {
  addCraft,
  getCrafts,
  deleteCraft,
};
