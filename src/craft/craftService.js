const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
};

const getCrafts = async () => {
  return await prisma.craft.findMany();
};

const deleteCraft = async (id) => {
  const craft = await prisma.craft.findUnique({
    where: { id },
  });

  if (!craft) throw new Error("Craft not found");

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
