import asyncHandler from "../utils/async-handler";
import prisma from "../config/database";
import { sendEmail } from "../utils/email";
import { initializePaystack, verifyPaystackPayment } from "../utils/paystack";


const adminGetAllOrders = asyncHandler(async (req, res, next) => {
  try {
    const {
      status,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build filter conditions
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          id: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          user: {
            name: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    if (startDate) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(startDate as string),
      };
    }

    if (endDate) {
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(endDate as string),
      };
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    res.status(200).json({
      orders,
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

const getUserOrders = asyncHandler(async (req: any, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
});

const getOrderById = asyncHandler(async (req: any, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    // Build query
    const where: any = { id };

    // If not admin, restrict to user's own orders
    if (!isAdmin) {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
});

const createOrder = asyncHandler(async (req: any, res, next) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    // Verify products and calculate total
    const productIds = items.map((item: any) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // Check if all products exist
    if (products.length !== productIds.length) {
      return res
        .status(400)
        .json({ message: "One or more products not found" });
    }

    // Check stock and calculate total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find((p: any) => p.id === item.productId);

      if (!product) {
        return res
          .status(400)
          .json({ message: `Product with ID ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });
    }

    // Calculate tax and total
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    // Generate reference ID for payment
    const reference = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        subtotal,
        tax,
        total,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod,
        reference,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Initialize payment
    let paymentData;

    if (paymentMethod === "PAYSTACK") {
      paymentData = await initializePaystack({
        email: req.user.email,
        amount: Math.round(total * 100), // Convert to kobo (smallest currency unit)
        reference,
        metadata: {
          orderId: order.id,
          userId,
        },
      });
    }

    res.status(201).json({
      message: "Order created successfully",
      order,
      payment: paymentData,
    });
  } catch (error) {
    next(error);
  }
});

const verifyPayment = asyncHandler(async (req, res, next) => {
  try {
    const { reference } = req.params;

    // Find order by reference
    const order = await prisma.order.findFirst({
      where: { reference },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify payment with Paystack
    const verificationResult = await verifyPaystackPayment(reference);

    if (verificationResult.status === "success") {
      // Update order payment status
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paidAt: new Date(),
        },
      });

      // Update product stock
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Send confirmation emails
      // To customer
      await sendEmail({
        to: order.user.email,
        subject: "Order Confirmation - PhoneHub",
        text: `Thank you for your order! Your order #${order.id} has been confirmed and is being processed.`,
        html: `<h1>Order Confirmation</h1><p>Thank you for your order!</p><p>Your order #${
          order.id
        } has been confirmed and is being processed.</p><p>Total: $${order.total.toFixed(
          2
        )}</p>`,
      });

      // To admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL as string,
        subject: "New Order Received - PhoneHub",
        text: `A new order #${order.id} has been placed by ${
          order.user.name
        } (${order.user.email}). Total: $${order.total.toFixed(2)}`,
        html: `<h1>New Order Received</h1><p>A new order #${
          order.id
        } has been placed by ${order.user.name} (${
          order.user.email
        }).</p><p>Total: $${order.total.toFixed(2)}</p>`,
      });

      res.status(200).json({
        message: "Payment verified successfully",
        order: {
          ...order,
          paymentStatus: "PAID",
          status: "PROCESSING",
        },
      });
    } else {
      res.status(400).json({
        message: "Payment verification failed",
        details: verificationResult,
      });
    }
  } catch (error) {
    next(error);
  }
});

const adminUpdateOrderStatus = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Send status update email to customer
    await sendEmail({
      to: order.user.email,
      subject: `Order Status Update - PhoneHub`,
      text: `Your order #${order.id} status has been updated to ${status}.`,
      html: `<h1>Order Status Update</h1><p>Your order #${order.id} status has been updated to ${status}.</p>`,
    });

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

export {
  adminGetAllOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  verifyPayment,
  adminUpdateOrderStatus,
};
