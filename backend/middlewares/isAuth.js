// middleware/auth.js
import jwt from "jsonwebtoken";

const isAuth = async(req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "Unauthorized: No token provided" });
    }

    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET); 
    req.userId = verifyToken.userId;

    console.log("✅ Token verified. userId:", req.userId);
    next();
    
  } catch (error) {
    console.error("❌ JWT verification failed:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default isAuth;
