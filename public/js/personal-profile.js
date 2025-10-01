import { initProfileData, generateUserPosts } from "./profile-data.js";
import { protectPage } from "./auth.js";
import { getProfilePosts } from "./api.js";
import { getLoggedInUser } from "./utils.js";

protectPage();

/**
 * Main function to load and display the logged-in user's profile page
 * - Fetches user profile date
 * - Loads their posts (or shows a "no posts" message if empty)
 * @returns {Promise<void>}
 */
async function main() {
  const loggedIn = getLoggedInUser();

  // load profile info
  await initProfileData(loggedIn.name);

  // Fetch posts created by the logged-in user
  const posts = await getProfilePosts(loggedIn.name);

  if (posts && posts.length > 0) {
    // If posts exist, display them
    generateUserPosts(posts);
  } else {
    // If no posts, display a message and a link to create a post
    const container = document.getElementById("noPostsMessage");

    container.innerHTML = `
      <span>No posts yet</span>
      <p>Your pet hasn't shared any adventures yet. Start by creating your first post and let the community meet them!</p>
      <a href="/posts/create" class="button">Create a post</a>
    `;
  }
}

// Run the main function on page load
main();
