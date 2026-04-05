import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getSingleProductById,
  updateProduct,
} from "../controllers/productController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

const productRouter = Router();

// GET /api/products
productRouter.get("/", getAllProducts);

// GET /api/products/:id
productRouter.get("/:id", getSingleProductById);

// GET /api/products/category/:category
productRouter.get("/category/:category", getProductsByCategory);

// only admin can access below routes
// POST /api/products
productRouter.post("/", verifyToken, isAdmin, addProduct);

// PUT /api/products/:id
productRouter.put("/:id", verifyToken, isAdmin, updateProduct);

// DELETE /api/products/:id
productRouter.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default productRouter;
