const jwt = require("jsonwebtoken");

// Secret key for JWT token validation (should be kept in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authenticateJWT = (
  req,
  res,
  next
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) throw res.status(403).json({ error: "No token provided" });

  // Verify the JWT token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateJWT };
