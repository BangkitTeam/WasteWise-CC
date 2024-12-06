const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserFavorites = async (userId) => {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId: userId,
    },
    include: {
      userRecommendation: {
        include: {
          craft: true, // Mengambil data craft yang terkait
        },
      },
    },
  });

  // Mengubah data menjadi format yang diinginkan
  const formattedFavorites = favorites.map((favorite) => ({
    id: favorite.id,
    title: favorite.userRecommendation.craft.title,
    description: favorite.userRecommendation.craft.description,
    imageUrl: favorite.userRecommendation.craft.imageUrl || "", // Jika tidak ada imageUrl, kosongkan
  }));

  return {
    user_id: userId,
    favorite: formattedFavorites,
  };
};

const addFavorite = async (favorite) => {
  if (!favorite.userId || !favorite.userRecommendationId) {
    throw new Error("userId dan userRecommendationId tidak boleh kosong.");
  }
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      AND: [
        { userId: favorite.userId },
        { userRecommendationId: favorite.userRecommendationId },
      ],
    },
  });

  if (existingFavorite) {
    throw new Error("Favorite already exists.");
  }

  const newFavorite = await prisma.favorite.create({
    data: {
      userId: favorite.userId,
      userRecommendationId: favorite.userRecommendationId,
    },
  });

  return newFavorite;
};

const deleteFavorite = async (id) => {
  const favorite = await prisma.favorite.findUnique({
    where: { id },
  });

  if (!favorite) throw new Error("Favorite not found");

  await prisma.favorite.delete({
    where: { id },
  });

  return {
    message: "Favorite deleted successfully",
  };
};

module.exports = {
  getUserFavorites,
  addFavorite,
  deleteFavorite,
};
