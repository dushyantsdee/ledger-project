const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env");
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.ownerId = decoded.ownerId;
    req.ownerEmail = decoded.email;

    next();
  } catch {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
}

module.exports = authMiddleware;
