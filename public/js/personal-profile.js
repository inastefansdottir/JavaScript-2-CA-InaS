import { initProfileData, generateUserPosts } from "./profile-data.js";
import { protectPage } from "./auth.js";
import { getProfilePosts } from "./api.js";
import { getLoggedInUser } from "./utils.js";

protectPage();

async function main() {
  const loggedIn = getLoggedInUser();

  // load profile info
  await initProfileData(loggedIn.name);

  const posts = await getProfilePosts(loggedIn.name);
  if (posts && posts.length > 0) {
    generateUserPosts(posts);
  } else {
    const container = document.getElementById("noPostsMessage");

    container.innerHTML = `
      <span>No posts yet</span>
      <p>Your pet hasn't shared any adventures yet. Start by creating your first post and let the community meet them!</p>
      <a href="/posts/create" class="button">Create a post</a>
    `;
  }
}

main();
