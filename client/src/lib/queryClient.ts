import { QueryClient, QueryFunction } from "@tanstack/react-query";
import staticProperties from "@/static/properties.json" assert { type: "json" };

const API_BASE_URL = "http://localhost:8080";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Prepend API_BASE if url starts with /api
  const fullUrl = url.startsWith("/api") ? `${API_BASE_URL}${url}` : url;
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Join the queryKey and prepend API_BASE_URL if it starts with /api
    let url = queryKey.join("/") as string;
    if (url.startsWith("/api")) {
      url = `${API_BASE_URL}${url}`;
    }
    try {
      const res = await fetch(url, {
        credentials: "include",
      });
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }
      await throwIfResNotOk(res);
      return await res.json();
    } catch (err) {
      // If fetching /api/properties fails, return static properties
      if (url.includes("/api/properties")) {
        return staticProperties;
      }
      throw err;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
