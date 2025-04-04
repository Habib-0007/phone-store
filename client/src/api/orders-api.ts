import axiosClient from "./axios-client";

export type OrderItem = {
  productId: string;
  quantity: number;
};

export type Address = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
};

export type CreateOrderData = {
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: "PAYSTACK" | "CARD";
};

export const ordersApi = {
  getOrders: async (params = {}) => {
    const response = await axiosClient.get("/orders", { params });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await axiosClient.get("/orders/my-orders");
    return response.data;
  },

  getOrder: async (id: string) => {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData: CreateOrderData) => {
    const response = await axiosClient.post("/orders", orderData);
    return response.data;
  },

  verifyPayment: async (reference: string) => {
    const response = await axiosClient.post(
      `/orders/verify-payment/${reference}`
    );
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await axiosClient.patch(`/orders/${id}/status`, {
      status,
    });
    return response.data;
  },
};
