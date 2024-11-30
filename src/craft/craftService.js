const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Service untuk menambah Craft
const addCraft = async (title, description) => {
  return await prisma.craft.create({
    data: { title, description },
  });
};

// Service untuk mendapatkan semua Craft
const getCrafts = async () => {
  return await prisma.craft.findMany();
};

// Service untuk menghapus Craft
const deleteCraft = async (id) => {
  const craft = await prisma.craft.findUnique({ where: { id } });

  if (!craft) throw new Error('Craft not found');

  await prisma.craft.delete({ where: { id } });

  return { message: 'Craft deleted successfully' };
};

module.exports = {
  addCraft,
  getCrafts,
  deleteCraft,
};
