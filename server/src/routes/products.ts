import express from "express";
import { validateRequest } from "../middleware/validate-request";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/products-validators";
import {
  getAllProducts,
  getProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "../controllers/productscontrollers";

const router = express.Router();

// Get all products
router.get("/", getAllProducts);

// Get product by ID
router.get("/:id", getProductById);

// Create product (admin only)
router.post(
  "/",
  authenticate as any,
  authorize(["ADMIN"]) as any,
  validateRequest(createProductSchema),
  adminCreateProduct
);

// Update product (admin only)
router.put(
  "/:id",
  authenticate as any,
  authorize(["ADMIN"]) as any,
  validateRequest(updateProductSchema),
  adminUpdateProduct
);

// Delete product (admin only)
router.delete(
  "/:id",
  authenticate as any,
  authorize(["ADMIN"]) as any,
  adminDeleteProduct
);

export default router;
