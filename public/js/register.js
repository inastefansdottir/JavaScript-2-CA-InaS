import { redirectLoggedIn } from "./auth.js";
import { registerUser } from "./api.js";

redirectLoggedIn();

const signupForm = document.getElementById("signupForm");

function onSignupFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);
  registerUser(formFields);
  console.log(formFields);
}

signupForm.addEventListener("submit", onSignupFormSubmit);
