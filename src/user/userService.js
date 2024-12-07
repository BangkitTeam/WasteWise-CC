const { PrismaClient } = require("@prisma/client");
const { decryptPassword, encryptPassword } = require("../utils/encryptionUtil");

// Initialize Prisma Client
const prisma = new PrismaClient();

// Service method to get the logged-in user's settings
const getUserSettings = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!user) throw new Error("User  not found");

  user.password = decryptPassword(user.password);
  return user;
};

const updateUserSettings = async (userId, newSettings) => {
  const existingUsername = await prisma.user.findUnique({
    where: { username: newSettings.username },
  });

  if (existingUsername && existingUsername.id !== userId)
    throw new Error("Username already exists");

  const existingEmail = await prisma.user.findUnique({
    where: { email: newSettings.email },
  });

  if (existingEmail && existingEmail.id !== userId)
    throw new Error("Email already exists");

  newSettings.password = encryptPassword(newSettings.password);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: newSettings,
  });

  return updatedUser;
};

// New service methods for favorites

// Add a favorite
const addFavorite = async (userId, userRecommendationId) => {
  // Ensure userRecommendationId is defined
  if (!userRecommendationId) {
    throw new Error("userRecommendationId is required");
  }

  const favorite = await prisma.userFavorite.create({
    data: {
      userId,
      userRecommendationId,
    },
  });
  return favorite;
};

// Delete a favorite
const deleteFavorite = async (userId, favoriteId) => {
  // Find the favorite to ensure it exists and belongs to the user
  const favorite = await prisma.userFavorite.findUnique({
    where: { id: parseInt(favoriteId) },
  });

  if (!favorite) {
    throw new Error("Favorite not found");
  }

  if (favorite.userId !== parseInt(userId)) {
    throw new Error("Unauthorized to delete this favorite");
  }

  // Delete the favorite
  await prisma.userFavorite.delete({
    where: { id: parseInt(favoriteId) },
  });

  return { message: "Favorite deleted successfully" };
};

// Get all favorites for a user
const getAllFavorites = async (userId) => {
  const favorites = await prisma.userFavorite.findMany({
    where: { userId },
    include: { userRecommendation: true }, // Include related data if needed
  });
  return favorites;
};

module.exports = {
  getUserSettings,
  updateUserSettings,
  addFavorite,
  deleteFavorite,
  getAllFavorites,
};
