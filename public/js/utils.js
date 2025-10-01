/**
 * Saves a value in localStorage under a given key
 * @param {string} key - The key to store the value under
 * @param {string} value - The value to be saved
 */
export function saveToken(key, value) {
  localStorage.setItem(key, value);
}

/**
 * Retrieves a value from localStorage by key
 * @param {string} key - The key to look up
 * @returns {string|null} - The stored value, or null if not found
 */
export function getToken(key) {
  return localStorage.getItem(key);
}

/**
 * Saves the username in localStorage
 * @param {string} username - The username to save
 */
export function saveUser(username) {
  localStorage.setItem("username", username);
}

/**
 * Retrieves the saved username from localStorage.
 * @returns {string|null} The username, or null if not found.
 */
export function getUser() {
  return localStorage.getItem("username");
}

/**
 * Retrieves the logged-in user object from localStorage
 * @returns {Object|null} The user object (`{ name: string, avatarUrl?: string}`) or null if not found
 */
export function getLoggedInUser() {
  const userString = localStorage.getItem("loggedInUser");
  if (!userString) return null;

  try {
    return JSON.parse(userString); // { name, avatarUrl }
  } catch (error) {
    console.error("Failed to parse logged-in user:", error);
    return null;
  }
}

/**
 * Clears all data from localStorage
 */
export function clearStorage() {
  localStorage.clear();
}
