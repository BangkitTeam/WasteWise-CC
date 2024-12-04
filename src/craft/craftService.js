const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

<<<<<<< HEAD
const addCraft = async (crafts) => {
    for (let craft of crafts) {
      const existingCraft = await prisma.craft.findUnique({
        where: {
          title: craft.title, 
        },
      });
  
      if (existingCraft) {
        throw new Error(`Craft with title "${craft.title}" already exists.`);
      }
    }
  
    const addedCrafts = await prisma.craft.createMany({
      data: crafts,
      skipDuplicates: true,  
    });
  
    return addedCrafts;
=======
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
>>>>>>> 95e748c63b4e77392e11a0d0a95bc3c128112186
};

const getCrafts = async () => {
  return await prisma.craft.findMany({
    include: {
      UserRecommendations: true, // Include relasi jika diperlukan
    },
  });
};

const deleteCraft = async (id) => {
  const craft = await prisma.craft.findUnique({
    where: { id },
  });

  if (!craft) throw new Error("Craft not found");
<<<<<<< HEAD
=======

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
>>>>>>> 95e748c63b4e77392e11a0d0a95bc3c128112186

  await prisma.craft.delete({
    where: { id },
  });

  return { message: "Craft deleted successfully" };
};

const updateCraft = async (id, craft) => {
    const { wasteType, title, description, imageUrl, tutorialUrl } = craft;
  
    const existingCraft = await prisma.craft.findUnique({
      where: { id: Number(id) },
    });
  
    if (!existingCraft) {
      throw new Error(`Craft with ID ${id} not found`);
    }
    const updatedCraft = await prisma.craft.update({
      where: { id: Number(id) },
      data: {
        wasteType,
        title,
        description,
        imageUrl,
        tutorialUrl,
      },
    });
  
    return updatedCraft;
  };
  

module.exports = {
  addCraft,
  getCrafts,
  deleteCraft,
  updateCraft,
};
