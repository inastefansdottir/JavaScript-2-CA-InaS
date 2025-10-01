import { protectPage } from "./auth.js";
import { fetchPosts } from "./api.js";
import { initPawButton } from "./paw-button.js";
import { shareFunction } from "./share.js";
import { getLoggedInUser } from "./utils.js";

protectPage(); // Only logged-in users can see the feed

let displayContainer = document.getElementById("displayContainer");

/**
 * Render posts to the feed
 * @param {Array} posts - Array of posts object from API
 */
function generatePosts(posts) {
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

    // Add post to DOM
    displayContainer.insertAdjacentHTML("beforeend", thumbnailHtml);

    const postElement = displayContainer.lastElementChild;
    const profile = getLoggedInUser();

    // If the post belongs to the logged-in user, redirect profile link to own profile
    const linkToProfile = postElement.querySelector(".profile-section-feed");
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
 * Fetch posts from API and render them
 */
async function main() {
  const posts = await fetchPosts();
  generatePosts(posts);
}

main();

// Reload page if coming back from, browser back button
window.addEventListener("pageshow", event => {
  if (event.persisted) {
    window.location.reload();
  }
});
