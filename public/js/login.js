import { loginUser } from "./api.js";

function addToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function getFromLocalStorage(key) {
  return localStorage.getItem(key);
}

const loginForm = document.getElementById("loginForm");

function onLoginFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);
  loginUser(formFields);
  console.log(formFields);
}

loginForm.addEventListener("submit", onLoginFormSubmit);
