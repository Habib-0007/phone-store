import axios from "axios";

interface PaystackInitializeOptions {
  email: string;
  amount: number;
  reference: string;
  metadata?: any;
}

export const initializePaystack = async (
  options: PaystackInitializeOptions
) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      options,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Paystack initialization error:", error);
    throw new Error("Failed to initialize payment");
  }
};

export const verifyPaystackPayment = async (reference: string) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Paystack verification error:", error);
    throw new Error("Failed to verify payment");
  }
};
