import express from "express";
import { validateRequest } from "../middleware/validate-request";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/orders-validators";
import {
  adminGetAllOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  verifyPayment,
  adminUpdateOrderStatus,
} from "../controllers/orderscontrollers";
const router = express.Router();

// Get all orders (admin only)
router.get(
  "/",
  authenticate as any,
  authorize(["ADMIN"]) as any,
  adminGetAllOrders
);

// Get user orders
router.get("/my-orders", authenticate as any, getUserOrders);

// Get order by ID
router.get("/:id", authenticate as any, getOrderById);

// Create order
router.post(
  "/",
  authenticate as any,
  validateRequest(createOrderSchema),
  createOrder
);

// Verify payment
router.post("/verify-payment/:reference", authenticate as any, verifyPayment);

// Update order status (admin only)
router.patch(
  "/:id/status",
  authenticate as any,
  authorize(["ADMIN"]) as any,
  validateRequest(updateOrderStatusSchema),
  adminUpdateOrderStatus
);

export default router;
