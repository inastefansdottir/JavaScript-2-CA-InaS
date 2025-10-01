import { protectPage } from "./auth.js";
import { fetchFollowingPosts, getProfilePosts, getPostById } from "./api.js";
import { initPawButton } from "./paw-button.js";
import { shareFunction } from "./share.js";
import { getLoggedInUser } from "./utils.js";

protectPage(); // Only logged-in users can access this page

let displayContainer = document.getElementById("displayContainer");

/**
 * Render posts on the feed page
 * @param {Array} posts - Array of post objects to display
 */
function generatePosts(posts) {
  // Show welcome message if no posts
  if (posts.length === 0) {
    const div = document.createElement("div");
    div.classList.add("no-posts-message");

    div.innerHTML = `
      <h1 class="welcome-message">Welcome to Petify!</h1>
      <p class="message">Your feed is empty because you're not following anyone yet and haven't posted anything.</p>
      <div class="button-wrapper">
        <a href="/posts/create" class="button">Create Your First Post</a>
        <a href="/discover" class="button discover-button">Discover Posts</a>
      </div>
      <p class="small-text">or search for users and posts</p>
    `;

    displayContainer.appendChild(div);
  }

  // Render each post thumbnail
  posts.forEach(post => {
    const thumbnailHtml = `
        <article class="post-thumbnail">
            <div class="divider"></div>
            <a href="/profile/${
              post.author?.name
            }" class="profile-section-feed">
                <img
                    src="${post.author?.avatar?.url}"
                    alt="profile picture"
                    class="small-profile-icon"
                />
                <span class="username">${post.author?.name}</span>
            </a>
            <img
                src="${post.media?.url || "/images/default-image.png"}"
                alt="${post.media?.alt || "post image"}"
                class="image-post"
                onerror="this.onerror=null; this.src='/images/default-image.png';"
            />
            <div class="buttons-wrapper">
                <button type="button" class="paw-button">
                    <img src="/images/paw-print-unclicked.svg" />
                </button>
                <span>${post._count?.reactions}</span>
                <a href="/posts/${post.id}" class="comment-button">
                    <ion-icon name="chatbubble-outline"></ion-icon>
                </a>
                <span>${post._count?.comments}</span>
                <button type="button" class="share-button">
                    <ion-icon name="share-outline"></ion-icon>
                </button>
            </div>
            <p class="description-section"><span class="description-name">${
              post.author?.name
            }:</span> ${post.body}</p>
        </article>
        `;

    displayContainer.insertAdjacentHTML("beforeend", thumbnailHtml);

    const postElement = displayContainer.lastElementChild;
    const profile = getLoggedInUser();
    const linkToProfile = postElement.querySelector(".profile-section-feed");

    // Redirect to own profile if this post belongs to current user
    if (profile.name === post.author?.name) {
      linkToProfile.href = "/profile";
    }

    // Select the button and count span for this post
    const likeButton = postElement.querySelector(".paw-button");
    const likeCountSpan = likeButton.nextElementSibling;

    initPawButton(likeButton, likeCountSpan, post.id, post.reactions);

    const shareButton = postElement.querySelector(".share-button");
    const postUrl = `/posts/${post.id}`;
    shareFunction(shareButton, postUrl);
  });
}

/**
 * Main function to fetch and display feed posts
 */
async function main() {
  const followingPosts = await fetchFollowingPosts();
  const profile = getLoggedInUser();

  // This is needed to get the reactors response from the api
  const userPosts = await getProfilePosts(profile.name);
  const detailedUserPosts = await Promise.all(
    userPosts.map(post => getPostById(post.id))
  );

  const allPosts = [...followingPosts, ...detailedUserPosts];

  // Sort posts by created date, newest first
  allPosts.sort((a, b) => new Date(b.created) - new Date(a.created));

  generatePosts(allPosts);
}

main();

// Reload page if browser restored from cache (fix back-button issues)
window.addEventListener("pageshow", event => {
  if (event.persisted) {
    window.location.reload();
  }
});
