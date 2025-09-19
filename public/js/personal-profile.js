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
  }
}

main();
