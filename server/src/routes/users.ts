import express from "express";
import { validateRequest } from "../middleware/validate-request";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import {
  updateUserSchema,
  updateAddressSchema,
} from "../validators/user-validator";
import {
  adminGetAllUsers,
  adminGetUserId,
  updateUserProfile,
  getUserAddress,
  addNewAddress,
  updateAddress,
  deleteAddress,
  wishlist,
  addProductToWishlist,
  removeProductFromWishlist,
} from "../controllers/usercontrolllers";

const router = express.Router();

router.get(
  "/",
  authenticate as any,
  authorize(["ADMIN"]) as any,
  adminGetAllUsers
);

router.get(
  "/:id",
  authenticate as any,
  authorize(["ADMIN"]) as any,
  adminGetUserId
);

router.put(
  "/profile",
  authenticate as any,
  validateRequest(updateUserSchema),
  updateUserProfile
);

router.get("/addresses", authenticate as any, getUserAddress);

router.post(
  "/addresses",
  authenticate as any,
  validateRequest(updateAddressSchema),
  addNewAddress
);

router.put(
  "/addresses/:id",
  authenticate as any,
  validateRequest(updateAddressSchema),
  updateAddress
);

router.delete("/addresses/:id", authenticate as any, deleteAddress);

router.get("/wishlist", authenticate as any, wishlist);

router.post("/wishlist/:productId", authenticate as any, addProductToWishlist);

router.delete(
  "/wishlist/:productId",
  authenticate as any,
  removeProductFromWishlist
);

export default router;
