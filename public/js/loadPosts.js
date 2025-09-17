import { getPostById, toggleReaction } from "./api.js";
import { getUser } from "./utils.js";
import { protectPage } from "./auth.js";

protectPage();

let displayContainer = document.getElementById("displayContainer");
const postId = displayContainer.dataset.postId;

if (!postId) {
  displayContainer.innerHTML = "<p>Missing author name or post ID in URL.</p>";
} else {
  loadPost(postId);
}

async function loadPost(postId) {
  try {
    const post = await getPostById(postId);
    console.log(post);

    if (!post) {
      throw new Error("Post not found");
    }

    const postHtml = `
        <article class="post-thumbnail">
            <div class="divider"></div>
            <div class="profile-section">
                <a type="button" id="backButton">
                    <ion-icon name="chevron-back" class="arrow-styling"></ion-icon>
                </a>
                <img
                    src="${post.author?.avatar?.url}"
                    alt="profile picture"
                    class="small-profile-icon"
                />
                <strong class="username">${post.author?.name}</strong>
            </div>
            <img
                src="${post.media?.url}"
                alt="${post.media?.alt}"
                class="image-post"
            />
            <div class="buttons-wrapper">
                <button type="button" class="paw-button">
                    <img src="/images/paw-print-unclicked.svg" />
                </button>
                <span>${post._count?.reactions ?? 0}</span>
                <div class="comment-button">
                    <ion-icon name="chatbubble-outline"></ion-icon>
                </div>
                <span>${post._count?.comments ?? 0}</span>
                <button type="button" class="share-button">
                    <ion-icon name="share-outline"></ion-icon>
                </button>
            </div>
            <div class="description-wrapper">
              <img
                src="${post.author?.avatar?.url}"
                alt="profile picture"
                class="small-profile-icon align-self"
              />
              <div class="text-wrapper">
                <strong class="description-name">${post.author?.name}</strong> 
                <p class="body-text">${post.body}</p>
              </div>
            </div>
        </article>
        `;

    displayContainer.innerHTML += postHtml;
    console.log(displayContainer);

    backButton();

    const likeButton = document.querySelector(".paw-button");
    const likeCountSpan = likeButton.nextElementSibling;
    const currentUser = getUser();

    // Total reactions (all symbols)
    let totalReactions = post.reactions.reduce((sum, r) => sum + r.count, 0);

    let pawReaction = post.reactions.find(r => r.symbol === "🐾");
    let liked = pawReaction && pawReaction.reactors.includes(currentUser);

    if (liked) {
      likeButton.innerHTML = `<img src="/images/paw-print-clicked.svg" />`;
    }
    likeCountSpan.textContent = totalReactions;

    likeButton.addEventListener("click", async e => {
      e.preventDefault();

      // Call API to toggle reaction
      const result = await toggleReaction(postId, "🐾"); // Paw symbol

      // Always refresh pawReaction from server response
      totalReactions = result.reactions.reduce((sum, r) => sum + r.count, 0);
      pawReaction = result.reactions.find(r => r.symbol === "🐾");

      // Update button state
      liked = pawReaction && pawReaction?.reactors.includes(currentUser);

      likeButton.innerHTML = liked
        ? `<img src="/images/paw-print-clicked.svg" />`
        : `<img src="/images/paw-print-unclicked.svg" />`;

      // Update count from API
      likeCountSpan.textContent = totalReactions;
    });

    console.log(currentUser, post.reactions);

    // Render each comment one by one
    const commentsSection = document.getElementById("commentsSection");

    if (post.comments && post.comments.length > 0) {
      post.comments.forEach(comment => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");

        commentElement.innerHTML = `
            <img
              src="${comment.author?.avatar?.url}"
              alt="user profile picture"
              class="small-profile-icon align-self"
            />
            <div class="text-wrapper">
              <strong class="description-name">${comment.author?.name}</strong> 
              <p class="body-text">${comment.body}</p>
            </div>
        `;

        commentsSection.appendChild(commentElement);
      });
    }
  } catch (error) {
    console.error("Error loading post:", error);
    displayContainer.innerHTML =
      "<p>Something went wrong while loading this post.</p>";
  }
}

function backButton() {
  // Event listener for back button
  const backButton = document.getElementById("backButton");
  if (backButton) {
    backButton.addEventListener("click", e => {
      e.preventDefault();
      window.history.back(); // go back to previous page
    });
  }
}
