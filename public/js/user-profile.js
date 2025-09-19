import { initProfileData, generateUserPosts } from "./profile-data.js";
import { protectPage } from "./auth.js";
import { getProfilePosts } from "./api.js";
import { backButton } from "./back-button.js";

protectPage();

async function main() {
  const pathParts = window.location.pathname.split("/");
  const name = pathParts[2]; // "/profile/name" > ["", "profile", "name"]

  // load profile info
  await initProfileData(name);

  const posts = await getProfilePosts(name);
  if (posts && posts.length > 0) {
    generateUserPosts(posts);
  }

  backButton();
}

document.addEventListener("DOMContentLoaded", main);
