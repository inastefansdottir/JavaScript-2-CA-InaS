import { getProfile } from "./api.js";
import { getLoggedInUser } from "./utils.js";

const profilePicture = document.getElementById("profilePicture");
const changeAvatarBtn = document.getElementById("changeAvatarBtn");

const username = document.getElementById("username");
const email = document.getElementById("email");

const signoutBtn = document.getElementById("signoutBtn");
const saveBtn = document.getElementById("saveBtn");

const loggedInUser = getLoggedInUser();

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

loadProfileData(loggedInUser.name);
