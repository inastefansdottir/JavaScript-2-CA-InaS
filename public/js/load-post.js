import { getPostById } from "./api.js";
import { protectPage } from "./auth.js";
import { initPawButton } from "./paw-button.js";
import { initCommentForm } from "./comment.js";
import { shareFunction } from "./share.js";
import { backButton } from "./back-button.js";
import { getLoggedInUser } from "./utils.js";

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
                <a href="/profile/${
                  post.author?.name
                }" class="profile" id="linkToProfile">
                    <img
                        src="${post.author?.avatar?.url}"
                        alt="profile picture"
                        class="small-profile-icon"
                    />
                    <span class="username">${post.author?.name}</span>
                </a>
                <a type="button" href="/posts/edit/${post.id}" id="editButton">
                    <ion-icon name="create-outline" class="edit-icon"></ion-icon>
                </a>
            </div>
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
                <span>${post._count?.reactions ?? 0}</span>
                <div class="comment-button">
                    <ion-icon name="chatbubble-outline"></ion-icon>
                </div>
                <span id="commentCountSpan">${post._count?.comments ?? 0}</span>
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

    // Only show edit button if logged in user is the author
    const profile = getLoggedInUser();
    const linkToProfile = document.getElementById("linkToProfile");
    if (profile.name === post.author?.name) {
      const editButton = document.getElementById("editButton");
      editButton.style.display = "block";
      linkToProfile.href = "/profile";
    }

    backButton();

    const likeButton = document.querySelector(".paw-button");
    const likeCountSpan = likeButton.nextElementSibling;

    initPawButton(likeButton, likeCountSpan, postId, post.reactions);

    const shareButton = document.querySelector(".share-button");
    shareFunction(shareButton);

    // Render each comment one by one
    const commentsSection = document.getElementById("commentsSection");

    if (post.comments && post.comments.length > 0) {
      post.comments.forEach(comment => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");

        commentElement.innerHTML = `
            <a href="/profile/${comment.author.name}">
              <img
                src="${comment.author?.avatar?.url}"
                alt="user profile picture"
                class="small-profile-icon align-self"
              />
            </a>
            <div class="text-wrapper">
              <a href="/profile/${comment.author.name}" class="remove-link-styling">
                <strong class="description-name">${comment.author?.name}</strong> 
              </a>
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

initCommentForm(postId);

window.addEventListener("pageshow", event => {
  if (event.persisted) {
    window.location.reload();
  }
});
