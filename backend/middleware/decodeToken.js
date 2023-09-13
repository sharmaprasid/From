const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Middleware to decode a JWT token
const decodeToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    // Verify and decode the token using the secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const userId = decoded.userId; // Get the decoded user ID
    res.status(200).json({ userId });
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.userId = decoded.userId; // Attach the decoded user ID to the request
    next();
  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(500).json({ error: "Failed to decode token" });
  }
};

module.exports = decodeToken;
