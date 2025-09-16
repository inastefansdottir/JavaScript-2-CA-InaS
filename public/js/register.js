import { redirectLoggedIn } from "./auth.js";
import { registerUser } from "./api.js";

redirectLoggedIn();

const signupForm = document.getElementById("signupForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const errorMsg = document.getElementById("errorMessage");

// Live error clearing
function clearFieldError(inputElement, errorElement) {
  inputElement.classList.remove("error");
  errorElement.textContent = "";
  errorMsg.innerHTML = "";
}

nameInput.addEventListener("input", () =>
  clearFieldError(nameInput, nameError)
);

emailInput.addEventListener("input", () =>
  clearFieldError(emailInput, emailError)
);

passwordInput.addEventListener("input", () =>
  clearFieldError(passwordInput, passwordError)
);

async function onSignupFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);

  console.log("Form fields:", formFields);
  console.log("Name value:", formFields.name);
  console.log("Email value:", formFields.email);
  console.log("Password value:", formFields.password);

  const errorIcon =
    '<ion-icon name="alert-circle" class="alert-circle"></ion-icon>';
  let hasError = false;

  // Clear previous messages
  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";

  // Simple input-level required checks
  if (!formFields.name) {
    nameError.textContent = "Username is required";
    nameInput.classList.add("error");
    hasError = true;
  }

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

  // Username restrictions
  const nameRegex = /^[a-zA-Z0-9_]+$/;
  if (formFields.name && !nameRegex.test(formFields.name)) {
    nameInput.classList.add("error");
    errorMsg.innerHTML = `<p class="error-message">${errorIcon} Username can only contain letters, numbers, and underscores. No spaces or special characters allowed.</p>`;
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
    const response = await registerUser(formFields);

    if (response?.ok) {
      signupForm.reset(); // clear the form
      alert("Registered successfully. Please log in.");
      location.href = "/auth/login";
    } else {
      // If registration fails, show errors
      if (response?.errors) {
        errorMsg.innerHTML = response.errors
          .map(
            error =>
              `<p class="error-message">${errorIcon} ${error.message}</p>`
          )
          .join("<br>");
      } else if (response?.message) {
        errorMsg.innerHTML = `<p class="error-message">${errorIcon} ${response.message}</p>`;
      } else {
        errorMsg.innerHTML = `<p class="error-message">${errorIcon} Registration failed. Please check your inputs.</p>`;
      }
    }
  } catch (error) {
    errorMsg.innerHTML = `<p class="error-message">${errorIcon} We can't reach the server right now. Please check your connection and try again.</p>`;
    console.error(error);
  }
}

signupForm.addEventListener("submit", onSignupFormSubmit);
