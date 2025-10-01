import { getToken } from "./utils.js";

const currentPath = window.location.pathname; // Current page path
const publicPages = ["/auth/login", "/auth/signup"]; // Pages that dont need login

/**
 * Check if the user is logged in
 * @returns {boolean} True is access token exists
 */
export function isAuthenticated() {
  return !!getToken("accessToken");
}

/**
 * Protect pages that require login
 * Redirects to login page if user is not authenticated
 */
export function protectPage() {
  if (!isAuthenticated() && !publicPages.includes(currentPath)) {
    window.location.href = "/auth/login";
  }
}

/**
 * Redirect logged-in users away from login/signup pages
 */
export function redirectLoggedIn() {
  if (isAuthenticated() && publicPages.includes(currentPath)) {
    window.location.href = "/";
  }
}
