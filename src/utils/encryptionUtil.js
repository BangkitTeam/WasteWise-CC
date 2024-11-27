const crypto = require("crypto");

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "your-encryption-key-that-needs-to-be-32-bytes"; 

// Ensure the key is 32 bytes long
const key = Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)); 

const IV_LENGTH = 16; 

const encryptPassword = (plainTextPassword) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(plainTextPassword, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
};

const decryptPassword = (encryptedPassword) => {
  const [iv, encrypted] = encryptedPassword.split(":");
  const ivBuffer = Buffer.from(iv, "hex");
  const encryptedBuffer = Buffer.from(encrypted, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuffer);
  let decrypted = decipher.update(encryptedBuffer, undefined, "utf8"); 
  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = { encryptPassword, decryptPassword };
