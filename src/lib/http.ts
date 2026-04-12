import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import { store } from "@/store/store";
import { clearAuth } from "@/store/authSlice";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach accessToken to every request if available
http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const { accessToken } = parseCookies();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

let isRedirecting = false;

export function redirectToSignIn() {
  if (isRedirecting || typeof window === "undefined") return;
  isRedirecting = true;
  destroyCookie(null, "accessToken", { path: "/" });
  destroyCookie(null, "refreshToken", { path: "/" });
  store.dispatch(clearAuth());
  window.location.href = "/sign-in";
}

// Handle 401 globally — clear tokens and redirect to sign-in
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToSignIn();
    }
    return Promise.reject(error);
  }
);

export default http;
