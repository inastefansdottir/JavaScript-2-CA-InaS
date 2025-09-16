import { redirectLoggedIn } from "./auth.js";
import { loginUser } from "./api.js";

redirectLoggedIn();

const loginForm = document.getElementById("loginForm");

async function onLoginFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);

  try {
    const response = await loginUser(formFields);
    const accessToken = response?.data?.accessToken;

    if (accessToken) {
      window.location.href = "/";
    }
  } catch (error) {
    console.log(error);
  }
}

loginForm.addEventListener("submit", onLoginFormSubmit);
