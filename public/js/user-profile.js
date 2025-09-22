import { initProfileData, generateUserPosts } from "./profile-data.js";
import { protectPage } from "./auth.js";
import {
  getProfilePosts,
  getProfile,
  followProfile,
  unfollowProfile
} from "./api.js";
import { backButton } from "./back-button.js";
import { getLoggedInUser } from "./utils.js";

protectPage();

async function main() {
  const pathParts = window.location.pathname.split("/");
  const name = pathParts[2]; // "/profile/name" > ["", "profile", "name"]

  // load profile info
  const profile = await initProfileData(name);

  const posts = await getProfilePosts(name);
  if (posts && posts.length > 0) {
    generateUserPosts(posts);
  }

  setupFollowButton(name, profile);

  backButton();

  console.log(profile);
}

function setupFollowButton(profileName) {
  const followButton = document.getElementById("followButton");
  const followersCount = document.getElementById("followersCount");

  const loggedInUser = getLoggedInUser();

  // Helper function to refresh profile and update button state
  async function refreshFollowState() {
    try {
      // Re-fetch the profile to get the latest followers
      const profile = await getProfile(profileName);

      // Check if the logged-in user is following this profile
      const isFollowing = profile.followers?.some(
        f => f.name === loggedInUser.name
      );

      // Update button text and icon
      followButton.innerHTML = isFollowing
        ? `Following <ion-icon name="checkmark-outline"></ion-icon>`
        : `Follow`;

      // Update button classes
      followButton.classList.toggle("following-button", isFollowing);
      followButton.classList.toggle("follow-button", !isFollowing);

      // Update followers count
      followersCount.textContent = profile._count?.followers ?? 0;
    } catch (error) {
      console.error("Error refreshing follow state:", error);
    }
  }

  // Initial button state
  refreshFollowState();

  // Handle click events
  followButton.addEventListener("click", async () => {
    try {
      // Determine current state
      const currentlyFollowing = followButton.textContent.includes("Following");

      if (currentlyFollowing) {
        // Call API to unfollow
        await unfollowProfile(profileName);
      } else {
        // Call API to follow
        await followProfile(profileName);
      }

      // Refresh the profile info after follow/unfollow
      await refreshFollowState();
    } catch (error) {
      console.error("Follow/unfollow failed:", error);
    }
  });
}

main();
