import asyncHandler from "../utils/async-handler";
import bcrypt from "bcryptjs";
import prisma from "../config/database";

const adminGetAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build filter conditions
    const where: any = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ];
    }

    if (role) {
      where.role = role;
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

const adminGetUserId = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
        _count: {
          select: {
            orders: true,
            wishlist: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

const updateUserProfile = asyncHandler(async (req: any, res, next) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email is already taken" });
      }
    }

    // Update data
    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Handle password change
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

const getUserAddress = asyncHandler(async (req: any, res, next) => {
  try {
    const userId = req.user.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    res.status(200).json({ addresses });
  } catch (error) {
    next(error);
  }
});

const addNewAddress = asyncHandler(async (req: any, res, next) => {
  try {
    const addressData = req.body;
    const userId = req.user.id;

    // If this is the default address, unset any existing default
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create address
    const address = await prisma.address.create({
      data: {
        ...addressData,
        userId,
      },
    });

    res.status(201).json({
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    next(error);
  }
});

const updateAddress = asyncHandler(async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const addressData = req.body;
    const userId = req.user.id;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If this is the default address, unset any existing default
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    // Update address
    const address = await prisma.address.update({
      where: { id },
      data: addressData,
    });

    res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    next(error);
  }
});

const deleteAddress = asyncHandler(async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Delete address
    await prisma.address.delete({
      where: { id },
    });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
});

const wishlist = asyncHandler(async (req: any, res, next) => {
  try {
    const userId = req.user.id;

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    res.status(200).json({ wishlist });
  } catch (error) {
    next(error);
  }
});

const addProductToWishlist = asyncHandler(async (req: any, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product is already in wishlist
    const existingItem = await prisma.wishlist.findFirst({
      where: { userId, productId },
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Product is already in wishlist" });
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json({
      message: "Product added to wishlist",
      wishlistItem,
    });
  } catch (error) {
    next(error);
  }
});

const removeProductFromWishlist = asyncHandler(async (req: any, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Check if product is in wishlist
    const wishlistItem = await prisma.wishlist.findFirst({
      where: { userId, productId },
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Remove from wishlist
    await prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    next(error);
  }
});

export {
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
};
