import axiosClient from "./axios-client";

export type ProductFilters = {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export const productsApi = {
  getProducts: async (filters: ProductFilters = {}) => {
    const response = await axiosClient.get("/products", { params: filters });
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: FormData) => {
    const response = await axiosClient.post("/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateProduct: async (id: string, productData: FormData) => {
    const response = await axiosClient.put(`/products/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },
};
