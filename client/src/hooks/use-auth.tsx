import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  
  const email = localStorage.getItem('email');
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/me", email],
    queryFn: async () => {
      if (!email) return null;
      const response = await apiRequest("GET", `/api/auth/me?email=${encodeURIComponent(email)}`);
      return response.json();
    },
    retry: false,
    enabled: !!localStorage.getItem('token') && !!email,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      const result = await response.json() as AuthResponse | { error: string };
      if ('error' in result) throw new Error(result.error);
      // Save email to localStorage for /me endpoint
      localStorage.setItem('email', data.email);
      return result as AuthResponse;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(["/api/auth/me", data.user.email], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      mobile?: string;
      role: string;
    }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      const result = await response.json() as AuthResponse | { error: string };
      if ('error' in result) throw new Error(result.error);
      // Save email to localStorage for /me endpoint
      localStorage.setItem('email', data.email);
      return result as AuthResponse;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(["/api/auth/me", data.user.email], data.user);
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    queryClient.setQueryData(["/api/auth/me"], null);
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
