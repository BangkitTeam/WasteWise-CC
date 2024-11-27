const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { decryptPassword, encryptPassword } = require("../utils/encryptionUtil");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; 

const registerUser = async (
  username,
  email,
  password
) => {
  const existingUserWIthSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUserWIthSameEmail) throw new Error("Email already in use");

  const existingUserWIthSameUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUserWIthSameUsername) throw new Error("Username already in use");

  const encryptedPassword = encryptPassword(password);

  // Create a new user
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: encryptedPassword,
    },
  });

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  };
};

// Function to handle login
const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  const decryptedPassword = decryptPassword(user.password);

  if (decryptedPassword !== password) throw new Error("Invalid password");

  const token = generateToken(user);
  return { token };
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "1d" } // Set expiration time (a day)
  );
};

module.exports = { registerUser, loginUser };