import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  authApi,
  type LoginCredentials,
  type RegisterData,
  type ForgotPasswordData,
  type ResetPasswordData,
} from "../api/auth-api";
import { useAuthStore } from "../store/auth-store";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success("Login successful");
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: () => {
      toast.success("Registration successful. Please login.");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast.success(
        "If your email is registered, you will receive a password reset link"
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to process request");
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success(
        "Password reset successful. Please login with your new password."
      );
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });
};

export const useCurrentUser = () => {
  const { isAuthenticated, updateUser } = useAuthStore();
  console.log(updateUser);
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authApi.getCurrentUser(),
    enabled: isAuthenticated,
    // onSuccess: (data) => {
    //   updateUser(data.user);
    // },
  });
};
