import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const queryClient = new QueryClient();

export const api = axios.create({
  baseURL: "/api/v1",
});

api.interceptors.request.use((config) => {
  // TODO: change this to support multiple events
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(undefined, (err) => {
  toast.error(err.response.data.message || "Something went wrong");
  return Promise.reject(err);
});