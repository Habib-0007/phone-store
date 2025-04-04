import asyncHandler from "../utils/async-handler";
import prisma from "../config/database";
import { uploadToCloudinary } from "../utils/cloudinary";

const getAllProducts = asyncHandler(async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build filter conditions
    const where: any = {};

    if (category) {
      where.category = {
        name: {
          equals: category as string,
          mode: "insensitive",
        },
      };
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ];
    }

    if (minPrice) {
      where.price = {
        ...where.price,
        gte: Number(minPrice),
      };
    }

    if (maxPrice) {
      where.price = {
        ...where.price,
        lte: Number(maxPrice),
      };
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
        },
        orderBy: {
          [sort as string]: order,
        },
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      products,
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

const getProductById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
});

const adminCreateProduct = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      stock,
      features,
      specifications,
      images,
    } = req.body;

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        features: features || [],
        specifications: specifications || {},
        category: {
          connect: { id: categoryId },
        },
      },
    });

    // Upload and associate images if provided
    if (images && images.length > 0) {
      const imagePromises = images.map(async (imageBase64: string) => {
        const uploadResult = await uploadToCloudinary(imageBase64);

        return prisma.productImage.create({
          data: {
            url: uploadResult.secure_url,
            productId: product.id,
          },
        });
      });

      await Promise.all(imagePromises);
    }

    // Get the product with images
    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: true,
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      product: productWithImages,
    });
  } catch (error) {
    next(error);
  }
});

const adminUpdateProduct = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      categoryId,
      stock,
      features,
      specifications,
      images,
    } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (features !== undefined) updateData.features = features;
    if (specifications !== undefined)
      updateData.specifications = specifications;

    if (categoryId !== undefined) {
      updateData.category = {
        connect: { id: categoryId },
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: true,
      },
    });

    // Handle image updates if provided
    if (images && images.length > 0) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      // Upload and associate new images
      const imagePromises = images.map(async (imageBase64: string) => {
        const uploadResult = await uploadToCloudinary(imageBase64);

        return prisma.productImage.create({
          data: {
            url: uploadResult.secure_url,
            productId: id,
          },
        });
      });

      await Promise.all(imagePromises);

      // Get updated product with new images
      const productWithImages = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: true,
        },
      });

      return res.status(200).json({
        message: "Product updated successfully",
        product: productWithImages,
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

const adminDeleteProduct = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete product images
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    // Delete product
    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export {
  getAllProducts,
  getProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
};
