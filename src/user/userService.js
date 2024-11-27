const { PrismaClient } = require("@prisma/client");
const { decryptPassword, encryptPassword } = require("../utils/encryptionUtil");

const prisma = new PrismaClient();

// Service method to get the logged-in user's settings
const getUserSettings = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!user) throw new Error("User not found");
  user.password = decryptPassword(user.password);
  
  return user;
};

const updateUserSettings = async (
  userId,
  newSettings
) => {
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

  // Update user settings in the database
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: newSettings,
  });

  return updatedUser;
};

module.exports = { getUserSettings, updateUserSettings };