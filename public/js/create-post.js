import { protectPage } from "./auth.js";
import { createPost } from "./api.js";
import { getUser } from "./utils.js";

protectPage();

const createForm = document.getElementById("form");
const altInput = document.getElementById("alt");
const bodyInput = document.getElementById("body");
const bodyCounter = document.getElementById("bodyCounter");

const altError = document.getElementById("altError");
const bodyError = document.getElementById("bodyError");
const imageError = document.getElementById("imageError");

// Upload container + button
const uploadImageContainer = document.getElementById("uploadImageContainer");
const uploadBtn = uploadImageContainer.querySelector(".upload-image-btn");

let selectedFile = null;

// Hidden file input
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.style.display = "none";
document.body.appendChild(fileInput);

// When user clicks upload button > open file picker
uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

// When a file is chosen
fileInput.addEventListener("change", () => {
  selectedFile = fileInput.files[0];
  if (!selectedFile) return;

  // Show preview by replacing container contents
  const previewUrl = URL.createObjectURL(selectedFile);
  uploadImageContainer.innerHTML = `<img src="${previewUrl}" alt="Preview of uploaded image" class="uploaded-image" />`;
  imageError.innerHTML = ""; // Clear error if user selects an image
});

// Update body counter on input
bodyInput.addEventListener("input", () => {
  const length = bodyInput.value.length;
  bodyCounter.textContent = `${length}/5000`;
  clearFieldError(bodyInput, bodyError);
});

// Live clearing
altInput.addEventListener("input", () => {
  clearFieldError(altInput, altError);
});

// Clear input error
function clearFieldError(inputElement, errorElement) {
  inputElement.classList.remove("error");
  if (errorElement) errorElement.textContent = "";
}

// Upload to Cloudinary
async function uploadToCloudinary(file) {
  const cloudName = "dobcqphb0";
  const uploadPreset = "Petify_profile";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
}

createForm.addEventListener("submit", async e => {
  e.preventDefault();

  // Reset errors
  imageError.innerHTML = "";
  altError.textContent = "";
  bodyError.textContent = "";
  altInput.classList.remove("error");
  bodyInput.classList.remove("error");

  let isValid = true;

  // Image validation
  if (!selectedFile) {
    imageError.innerHTML = "Image is required.";
    isValid = false;
  }

  // Alt text validation
  if (!altInput.value.trim()) {
    altError.textContent = "Alt text is required.";
    altInput.classList.add("error");
    isValid = false;
  }

  // Body validation
  if (!bodyInput.value.trim()) {
    bodyError.textContent = "Body is required";
    bodyInput.classList.add("error");
    isValid = false;
  } else if (bodyInput.value.length > 5000) {
    bodyError.textContent = "Body cannot exceed 5000 characters.";
    bodyInput.classList.add("error");
    isValid = false;
  }

  if (!isValid) return; // stop submission if validation failed

  const submitBtn = createForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  try {
    let mediaUrl = "";
    if (selectedFile) {
      mediaUrl = await uploadToCloudinary(selectedFile);
    }

    const altText = altInput.value.trim();
    const body = bodyInput.value.trim();
    const name = getUser();

    const title = body ? body.substring(0, 20) + "..." : `Post by ${name}`;

    const postData = {
      title,
      body,
      media: mediaUrl
        ? {
            url: mediaUrl,
            alt: altText
          }
        : null
    };

    const data = await createPost(postData);

    if (data) {
      alert("Your post was published!");
      location.href = "/"; // redirect to feed
    } else {
      alert("Failed to publish post. Check console for details.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while publishing your post.");
  } finally {
    submitBtn.disabled = false;
  }
});
