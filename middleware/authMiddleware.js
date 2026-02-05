const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
 // same jo authRoutes me hai

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // ❌ Token nahi mila
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Expected format: Bearer TOKEN
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ ownerId request me attach
    req.ownerId = decoded.ownerId;

    next(); // request aage bhejo
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
