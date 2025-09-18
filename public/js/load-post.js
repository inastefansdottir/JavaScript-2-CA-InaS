import { getPostById } from "./api.js";
import { protectPage } from "./auth.js";
import { initPawButton } from "./paw-button.js";

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

    initPawButton(likeButton, likeCountSpan, postId, post.reactions);

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

window.addEventListener("pageshow", event => {
  if (event.persisted) {
    window.location.reload();
  }
});
