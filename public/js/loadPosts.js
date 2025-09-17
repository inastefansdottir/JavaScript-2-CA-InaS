import { getPostById } from "./api.js";
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
                <span class="username">${post.author?.name}</span>
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
            <p class="description-section"><span class="description-name">${
              post.author?.name
            }:</span> ${post.body}</p>
        </article>
        `;

    displayContainer.innerHTML += postHtml;
    console.log(displayContainer);

    // Event listener for back button
    const backButton = document.getElementById("backButton");
    if (backButton) {
      backButton.addEventListener("click", e => {
        e.preventDefault();
        window.history.back(); // go back to previous page
      });
    }
  } catch (error) {
    console.error("Error loading post:", error);
    displayContainer.innerHTML =
      "<p>Something went wrong while loading this post.</p>";
  }
}
