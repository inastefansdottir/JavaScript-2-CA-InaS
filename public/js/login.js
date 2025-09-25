import { redirectLoggedIn } from "./auth.js";
import { loginUser } from "./api.js";

redirectLoggedIn();

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const errorMsg = document.getElementById("errorMessage");

// Live error clearing
function clearFieldError(inputElement, errorElement) {
  inputElement.classList.remove("error");
  errorElement.textContent = "";
  errorMsg.innerHTML = "";
}

emailInput.addEventListener("input", () =>
  clearFieldError(emailInput, emailError)
);

passwordInput.addEventListener("input", () =>
  clearFieldError(passwordInput, passwordError)
);

async function onLoginFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);

  const errorIcon =
    '<ion-icon name="alert-circle" class="alert-circle"></ion-icon>';
  let hasError = false;

  // Clear previous messages
  emailError.textContent = "";
  passwordError.textContent = "";

  // Simple input-level required checks
  if (!formFields.email) {
    emailError.textContent = "Email is required";
    emailInput.classList.add("error");
    hasError = true;
  }

  if (!formFields.password) {
    passwordError.textContent = "Password is required";
    passwordInput.classList.add("error");
    hasError = true;
  }

  // Email validation
  if (formFields.email && !emailInput.checkValidity()) {
    emailInput.classList.add("error");
    errorMsg.innerHTML = `<p class="error-message">${errorIcon} ${emailInput.validationMessage}</p>`;
    hasError = true;
  }

  // Password validation
  const minPasswordLength = 8;
  if (passwordInput.value.length < minPasswordLength) {
    passwordInput.classList.add("error");
    errorMsg.innerHTML = `<p class="error-message">${errorIcon} Password must be at least ${minPasswordLength} characters long.</p>`;
    hasError = true;
  }

  // If any error happened, stop here
  if (hasError) return;

  try {
    const response = await loginUser(formFields);
    const accessToken = response?.data?.accessToken;

    if (accessToken) {
      window.location.href = "/";
    }
  } catch (error) {
    console.error(error);

    const errorIcon =
      '<ion-icon name="alert-circle" class="alert-circle"></ion-icon>';
    errorMsg.innerHTML = `<p class="error-message">${errorIcon} ${
      error.message || "Invalid email or password"
    }</p>`;
  }
}

loginForm.addEventListener("submit", onLoginFormSubmit);
