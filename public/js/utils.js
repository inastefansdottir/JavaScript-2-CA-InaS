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
