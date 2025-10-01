import {
  getPostById,
  deletePost,
  updatePostDescription,
  deleteComment
} from "./api.js";
import { protectPage } from "./auth.js";
import { backButton } from "./back-button.js";
import { getLoggedInUser } from "./utils.js";

protectPage(); // Only logged-in users can access this page

let displayContainer = document.getElementById("displayContainer");
const postId = displayContainer.dataset.postId;

// Show error if there is no post ID
if (!postId) {
  displayContainer.innerHTML = "<p>Missing post ID in URL.</p>";
} else {
  loadPost(postId);
}

/**
 * Load a single post and render it with editable description and comments
 * @param {string} postId - The ID of the post to load
 */
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
                <strong class="username">${post.author?.name}</strong>
                <button type="button" class="delete-button" id="deletePostBtn">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </div>
            <img
                src="${post.media?.url || "/images/default-image.png"}"
                alt="${post.media?.alt || "post image"}"
                class="image-post"
                onerror="this.onerror=null; this.src='/images/default-image.png';"
            />
            <form class="description-form">
                <label for="body">Edit Description</label>
                <textarea
                    id="body"
                    name="body"
                    class="input-styling"
                    rows="5">${post.body || ""}</textarea>  
            </form>
        </article>
        `;

    displayContainer.innerHTML += postHtml;
    console.log(post);

    backButton(); // Initialize back button

    // Delete post
    const deleteBtn = document.getElementById("deletePostBtn");

    deleteBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete this post?")) {
        const success = await deletePost(postId);
        if (success) {
          alert("Post deleted!");
          window.location.href = "/profile";
        }
      }
    });

    // Save description buttons (desktop + mobile)
    const saveBtns = document.querySelectorAll(".save-button");

    saveBtns.forEach(btn => {
      btn.addEventListener("click", async e => {
        e.preventDefault(); // prevent default submission
        const newBody = document.getElementById("body").value.trim();
        if (!newBody) return alert("Description cannot be empty");

        const updated = await updatePostDescription(postId, newBody);
        if (updated) {
          alert("Post updated!");
          window.location.href = `/posts/${postId}`;
        }
      });
    });

    // Render each comment one by one
    const commentsSection = document.getElementById("commentsSection");

    if (post.comments && post.comments.length > 0) {
      const profile = getLoggedInUser();
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
            <button data-comment-id="${comment.id}" type="button" class="delete-comment">
              <ion-icon name="close-outline"></ion-icon>
            </button>
        `;

        commentsSection.appendChild(commentElement);

        // Delete comment if current user is author
        const deleteCommentBtn =
          commentElement.querySelector(".delete-comment");
        if (profile.name === comment.author?.name) {
          deleteCommentBtn.addEventListener("click", async () => {
            const commentId = deleteCommentBtn.dataset.commentId;
            if (confirm("Are you sure you want to delete this comment?")) {
              const success = await deleteComment(postId, commentId);
              if (success) {
                commentElement.remove(); // remove from DOM
              }
            }
          });
        } else {
          // hide delete buttons if not author
          deleteCommentBtn.style.display = "none";
        }
      });
    }
  } catch (error) {
    console.error("Error loading post:", error);
    displayContainer.innerHTML =
      "<p>Something went wrong while loading this post.</p>";
  }
}
