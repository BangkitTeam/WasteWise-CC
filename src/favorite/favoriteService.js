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

  const formattedFavorites = favorites.map((favorite) => ({
    id: favorite.id,
    title: favorite.userRecommendation.craft.title,
    description: favorite.userRecommendation.craft.description,
    imageUrl: favorite.userRecommendation.craft.imageUrl || "",
  }));

  return {
    user_id: userId,
    favorite: formattedFavorites,
  };
};

const markRecommendationAsFavorite = async (userId, recommendationId) => {
  console.log("===== Debugging markRecommendationAsFavorite =====");
  console.log("Received userId:", userId);
  console.log("Received recommendationId:", recommendationId);

  if (!userId) {
    console.error("Error: User ID is required");
    throw new Error("User ID is required");
  }

  // Konversi recommendationId ke integer
  const recommendationIdInt = parseInt(recommendationId);
  console.log("Parsed recommendationId:", recommendationIdInt);

  // Cek apakah rekomendasi milik user tersebut ada
  const userRecommendation = await prisma.userrecommendation.findFirst({
    where: {
      id: recommendationIdInt,
      userId: userId,
    },
  });

  console.log("Fetched userRecommendation:", userRecommendation);

  if (!userRecommendation) {
    console.error("Error: User recommendation not found.");
    throw new Error("User recommendation not found.");
  }

  // Cek apakah craft yang terkait dengan rekomendasi sudah ada dalam daftar favorit
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      userId: userId,
      userRecommendation: {
        craftId: userRecommendation.craftId, // Cek berdasarkan craftId
      },
    },
  });

  console.log("Existing favorite:", existingFavorite);

  if (existingFavorite) {
    console.error("Error: Craft already in favorites.");
    throw new Error("Craft already in favorites.");
  }

  // Tambahkan ke favorit
  const newFavorite = await prisma.favorite.create({
    data: {
      userId: userId,
      userRecommendationId: userRecommendation.id,
    },
  });

  console.log("New favorite created:", newFavorite);

  console.log("===== End of Debugging =====");
  return newFavorite;
};

const unmarkRecommendationAsFavorite = async (favoriteId, userId) => {
  // Cek jika favorite ada dan milik user yang tepat
  const favorite = await prisma.favorite.findUnique({
    where: { id: favoriteId },
    include: { userRecommendation: true },
  });

  if (!favorite) {
    throw new Error("Favorite not found");
  }

  if (favorite.userId !== userId) {
    throw new Error("You are not authorized to unmark this favorite.");
  }

  // Hapus favorite
  await prisma.favorite.delete({
    where: { id: favoriteId },
  });

  // Hapus informasi createdAt dan updatedAt pada userRecommendation sebelum mengembalikannya
  const { createdAt, updatedAt, ...userRecommendationWithoutTimestamps } = favorite.userRecommendation;

  return {
    message: "Favorite successfully unmarked",
    deletedFavorite: {
      ...favorite,
      userRecommendation: userRecommendationWithoutTimestamps, // Mengembalikan userRecommendation tanpa createdAt dan updatedAt
    },
  };
};


module.exports = {
  getUserFavorites,
  markRecommendationAsFavorite, // Mengganti nama fungsi dari addFavorite
  unmarkRecommendationAsFavorite,
};
