export function saveToken(key, value) {
  localStorage.setItem(key, value);
}

export function getToken(key) {
  return localStorage.getItem(key);
}

export function saveUser(username) {
  localStorage.setItem("username", username);
}

export function getUser() {
  return localStorage.getItem("username");
}

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

export function clearStorage() {
  localStorage.clear();
}
