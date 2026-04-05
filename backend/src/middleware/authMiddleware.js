import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

//================ Middleware to verify if the user is logged in
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access Denied. No token provided." 
      });
    }

    // Token verify 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Decoded data (user id, role etc.) request object-e will be added for use in next middlewares or controllers
    req.user = decoded; 
    
    // if token is valid, call next middleware or controller
    next(); 
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token. Please login again." 
    });
  }
};

//================ Middleware to check admin role
export const isAdmin = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await userModel.findById(id);

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in admin middleware",
      error: error.message,
    });
  }
};
