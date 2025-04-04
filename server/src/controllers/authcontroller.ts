import asyncHandler from "../utils/async-handler";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email";
import prisma from "../config/database";

const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      );

      await sendEmail({
        to: user.email,
        subject: "Welcome to PhoneHub!",
        text: `Hi ${user.name}, welcome to PhoneHub! Thank you for signing up.`,
        html: `<h1>Welcome to PhoneHub!</h1><p>Hi ${user.name},</p><p>Thank you for signing up. We're excited to have you on board!</p>`,
      });

      const { password: _, ...userData } = user;

      res.status(201).json({
        message: "User registered successfully",
        user: userData,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    await sendEmail({
      to: user.email,
      subject: "New Login to Your PhoneHub Account",
      text: `Hi ${user.name}, we detected a new login to your account. If this wasn't you, please contact support immediately.`,
      html: `<h1>New Login Detected</h1><p>Hi ${user.name},</p><p>We detected a new login to your account. If this wasn't you, please contact support immediately.</p>`,
    });

    const { password: _, ...userData } = user;

    res.status(200).json({
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    next(error);
  }
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(200).json({
        message:
          "If your email is registered, you will receive a password reset link",
      });
    }

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    await prisma.passwordReset.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your PhoneHub Password",
      text: `Hi ${user.name}, please use the following link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
      html: `<h1>Reset Your Password</h1><p>Hi ${user.name},</p><p>Please use the following link to reset your password:</p><p><a href="${resetUrl}">Reset Password</a></p><p>This link will expire in 1 hour.</p>`,
    });

    res.status(200).json({
      message:
        "If your email is registered, you will receive a password reset link",
    });
  } catch (error) {
    next(error);
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        token,
        userId: decoded.id,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.delete({
      where: { id: resetRecord.id },
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
});

const verifyMe = asyncHandler(async (req: any, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
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

export { register, login, forgotPassword, resetPassword, verifyMe };