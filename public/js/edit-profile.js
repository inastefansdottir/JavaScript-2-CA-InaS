import { getProfile, updateAvatar } from "./api.js";
import { getLoggedInUser } from "./utils.js";

const profilePicture = document.getElementById("profilePicture");
const changeAvatarBtn = document.getElementById("changeAvatarBtn");

const username = document.getElementById("username");
const email = document.getElementById("email");

const signoutBtn = document.getElementById("signoutBtn");
const saveBtn = document.getElementById("saveBtn");

const loggedInUser = getLoggedInUser();

// This will temporarily store the new avatar file, until the user clicks "save"
let newAvatarFile = null;

/**
 * Loads profile data for a given user and updates UI
 * @param {string} name - The username to load profile data for
 */
async function loadProfileData(name) {
  try {
    const profile = await getProfile(name);

    profilePicture.src =
      profile.avatar?.url || "/images/placeholder-profile-image.png";

    username.textContent = profile.name;
    email.textContent = profile.email;
  } catch (error) {
    console.error("Error loading profile information:", error);
  }
}

// Initialize profile data on page load
loadProfileData(loggedInUser.name);

/**
 * uploads a file to Cloudinary and returns the secure URL
 * @param {file} file - The image file to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 * @throws Will throw an error if the upload fails
 */
async function uploadToCloudinary(file) {
  const cloudName = "dobcqphb0";
  const uploadPreset = "Petify_profile";

  const formData = new FormData();
  formData.append("file", file); // the actual file
  formData.append("upload_preset", uploadPreset); // my preset settings;

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

/**
 * Handles avatar change: creates a temporary file input, previews selected image
 */
changeAvatarBtn.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = () => {
    newAvatarFile = fileInput.files[0];
    if (!newAvatarFile) return;

    // show preview before saving
    profilePicture.src = URL.createObjectURL(newAvatarFile);
  };

  fileInput.click();
});

// Save button -> upload to Cloudinary, then update API
saveBtn.addEventListener("click", async () => {
  try {
    if (newAvatarFile) {
      // 1. Upload new avatar to Cloudinary
      const uploadedUrl = await uploadToCloudinary(newAvatarFile);

      // 2. Update Noroff API
      const updatedProfile = await updateAvatar(loggedInUser.name, uploadedUrl);

      // 3. Confirm UI updates with saved avatar
      if (updatedProfile) {
        profilePicture.src = updatedProfile.avatar.url;
      }
    }

    alert("Profile saved successfully!");

    // Redirect to profile after saving
    window.location.href = "/profile";
  } catch (error) {
    console.error("Error saving profile:", error);
  }
});
