import { RequestHandler } from "express";

export const validateRequest = (schema: any): RequestHandler => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
};
