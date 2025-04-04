import axiosClient from "./axios-client";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type ForgotPasswordData = {
  email: string;
};

export type ResetPasswordData = {
  token: string;
  password: string;
};

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axiosClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await axiosClient.post("/auth/register", data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await axiosClient.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await axiosClient.post("/auth/reset-password", data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosClient.get("/auth/me");
    return response.data;
  },
};
