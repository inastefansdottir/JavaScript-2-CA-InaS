import { protectPage } from "./auth.js";
import { createPost } from "./api.js";
import { getUser } from "./utils.js";

protectPage();

const createForm = document.getElementById("form");
const altInput = document.getElementById("alt");
const bodyInput = document.getElementById("body");
const bodyCounter = document.getElementById("bodyCounter");

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
});

// Update body counter on input
bodyInput.addEventListener("input", () => {
  const length = bodyInput.value.length;
  bodyCounter.textContent = `${length}/10000`;
});

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
