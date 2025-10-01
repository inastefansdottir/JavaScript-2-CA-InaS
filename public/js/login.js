import { redirectLoggedIn } from "./auth.js";
import { loginUser } from "./api.js";

// Redirect already logged-in users away from login page
redirectLoggedIn();

// Grab form elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Error message elements
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const errorMsg = document.getElementById("errorMessage");

// Function to clear errors as user types
function clearFieldError(inputElement, errorElement) {
  inputElement.classList.remove("error");
  errorElement.textContent = "";
  errorMsg.innerHTML = "";
}

// Live clearing for email and password fields
emailInput.addEventListener("input", () =>
  clearFieldError(emailInput, emailError)
);
passwordInput.addEventListener("input", () =>
  clearFieldError(passwordInput, passwordError)
);

/**
 * Handles form subkission for login
 */
async function onLoginFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData); // { email, passowrd }

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

  // Submit lofin request
  try {
    const response = await loginUser(formFields);
    const accessToken = response?.data?.accessToken;

    if (accessToken) {
      // Redirect to homepage on successful login
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

// Attach form submit handler
loginForm.addEventListener("submit", onLoginFormSubmit);
