const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { decryptPassword, encryptPassword } = require("../utils/encryptionUtil");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use a secret key for JWT

const registerUser = async (
  username,
  email,
  password
) => {
  // Check if the user already exists
  const existingUserWIthSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  // If the user already exists with the same email, throw an error
  if (existingUserWIthSameEmail) throw new Error("Email already in use");

  // Check if the user already exists
  const existingUserWIthSameUsername = await prisma.user.findUnique({
    where: { username },
  });

  // If the user already exists with the same username, throw an error
  if (existingUserWIthSameUsername) throw new Error("Username already in use");

  // Encrypt the password
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
  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  // Decrypt the stored password and compare with entered password
  const decryptedPassword = decryptPassword(user.password);

  if (decryptedPassword !== password) throw new Error("Invalid password");

  // Generate JWT token if authentication is successful
  const token = generateToken(user);
  return { token };
};

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: "1d" } // Set expiration time (1 day)
  );
};

module.exports = { registerUser, loginUser };