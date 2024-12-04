const crypto = require("crypto");

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "your-encryption-key-that-needs-to-be-32-bytes"; // Make sure this is 32 bytes

// Ensure the key is 32 bytes long
const key = Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)); // Pad with '0' and slice to 32 bytes

const IV_LENGTH = 16; // AES block size is 16 bytes

const encryptPassword = (plainTextPassword) => {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate random initialization vector
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(plainTextPassword, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return the iv and encrypted password combined
  return iv.toString("hex") + ":" + encrypted;
};

const decryptPassword = (encryptedPassword) => {
  const [iv, encrypted] = encryptedPassword.split(":");
  const ivBuffer = Buffer.from(iv, "hex");
  const encryptedBuffer = Buffer.from(encrypted, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuffer);
  let decrypted = decipher.update(encryptedBuffer, undefined, "utf8"); // Use `undefined` for input encoding
  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = { encryptPassword, decryptPassword };
