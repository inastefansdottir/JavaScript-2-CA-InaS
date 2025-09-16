import { getFromLocalStorage } from "./utils.js";

const currentPath = window.location.pathname;
const publicPages = ["/auth/login", "/auth/signup"];

export function isAuthenticated() {
  return !!getFromLocalStorage("accessToken");
}

// Protect all pages except login/signup
export function protectPage() {
  if (!isAuthenticated() && !publicPages.includes(currentPath)) {
    window.location.href = "/auth/login";
  }
}

export function redirectLoggedIn() {
  if (isAuthenticated() && publicPages.includes(currentPath)) {
    window.location.href = "/";
  }
}
