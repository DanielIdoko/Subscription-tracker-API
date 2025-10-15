import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.models.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Decode and verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Attach user object to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - Invalid or expired token",
      error: error.message,
    });
  }
};

export default authMiddleware;
