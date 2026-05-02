"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse, Cart } from "@/types";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

export function useCart() {
  const { isAuthenticated } = useAuthStore();
  return useQuery<Cart>({
    queryKey: ["cart"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Cart>>("/api/cart");
      return data.data;
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { productId: number; quantity: number }) =>
      api.post("/api/cart/items", vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Ürün sepete eklendi");
    },
    onError: () => toast.error("Ürün eklenemedi"),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      api.put(`/api/cart/items/${productId}`, null, { params: { quantity } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => toast.error("Güncellenemedi"),
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => api.delete(`/api/cart/items/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Ürün sepetten çıkarıldı");
    },
    onError: () => toast.error("Silinemedi"),
  });
}
